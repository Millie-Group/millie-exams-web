<template>
  <div class="wrap">
    <div class="outer">
      <h1>Available files</h1>
      <div class="inner">
        <div v-for="file in files.filter(x => !x.studentId)" :key="file.id" @click="() => {downloadUrl = file.url; downloadName = file.name}">
          <div @click="download(file.url, file.name)">
            {{file.name}}
          </div>
        </div>
        <div v-if="!files.filter(x => !x.studentId).length">
          No files available yet!
        </div>
      </div>
    </div>
    <div class="outer">
      <h1>Your files</h1>
      <div class="inner">
        <div v-for="file in files.filter(x => x.studentId)" :key="file.id" @click="() => {downloadUrl = file.url; downloadName = file.name}">
          <div @click="download(file.url, file.name)">
            {{file.name}}
          </div>
        </div>
        <div v-if="!files.filter(x => x.studentId).length">
          You haven't sent any files
        </div>
        <FileInputGeneral v-if="showUpload" :file.sync="fileInput" />
        <template v-if="fileInputArr.length">
          ({{fileInputArr.length}} {{fileInputArr.length === 1 ? 'file' : 'files'}})
          <button class="upload" @click="upload">
            Submit <i class="bx bx-send" />
          </button>
        </template>
        <a v-if="files.filter(x => x.studentId).length" href="https://forms.monday.com/forms/6dfd387df24b7e112ba89d7cad2a6de4" class="survey" target="_blank">
          Help us grow by filling out a survey <i class="bx bx-link-external" />
        </a>
      </div>
    </div>
    <!-- <DownloadFile :url.sync="downloadUrl" :name="downloadName" /> -->
  </div>
</template>

<script>
import * as fileDL from 'js-file-download';
export default {
  props: {
    files: Array,
    showUpload: Boolean,
    examId: Number
  },
  data() {
    return {
      downloadUrl: null,
      downloadName: null,

      fileInput: null,
      fileInputArr: [],
    }
  },
  methods: {
    async download(url, name) {
      const data = await this.$axios.$get(url, {
        responseType: 'blob'
      });
      const _url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = _url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
    },
    async upload() {
      for (const f of this.fileInputArr) {
        const data = await this.$axios.$post('student-file-url', {
          access: this.$route.params.id,
          name: f.name,
          examId: this.examId
        });
        const {url} = data;
        const {fields} = data;
        const {key} = fields;

        const formData = new FormData();

        formData.append('key', fields.key);

        for (const [k, v] of Object.entries(fields).filter(([k, v]) => k !== 'key'))
          formData.append(k, v);

        formData.append('file', f, f.name);

        const axiosNoAuth = this.$axios.create();
        axiosNoAuth.setHeader('Authorization', null);
        await axiosNoAuth.$post(url, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        });
      }

      await this.$axios.$post('student-send-email-after-upload', {
        access: this.$route.params.id,
        names: this.fileInputArr.map(x => x.name)
      });

      window.location.reload();
    }
  },
  watch: {
    // async download(url, name) {
    //   const data = await this.$axios.$get(url);
    // }
    fileInput(n) {
      if (!n) return;

      this.fileInputArr = [...this.fileInputArr, n];
      this.fileInput = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  margin: 15px 0 25px;
  & > * {
    flex-grow: 1;
    flex-basis: 100%;
  }
  & > * + * {
    margin-left: 30px;
  }
}
.inner {
  border: 2px solid black;
  border-radius: 5px;
  padding: 10px;
  & > div {
    cursor: pointer;
  }
}
h1 {
  font-size: .9rem;
  font-weight: 500;
  margin-bottom: 3px;
}
.survey {
  font-weight: 500;
  margin-top: 5px;
  display: block;
  display: flex;
  align-items: center;
  i {
    margin-left: 7px;
  }
}
.upload {
  @include flex-center(v);
  border-radius: 5px;
  font-weight: 500;
  font-size: 1.1rem;
  color: #ff4b00;
  background: transparentize($color: #ff4b00, $amount: .94);
  padding: .3em .6em;
  i {
    margin-left: 7px;
  }
  margin: 10px 0;
}
</style>
