<template>
  <div class="wrap">
    <h1>Files</h1>
    <!-- {{groups}} -->
    <div class="group">
      <h2>Proctor Files</h2>
      <div class="inner">
        <div v-for="(proctorFile, idx) in proctorFiles" :key="`proctor-${idx}`">
          <div class="proctor-file">
            <div @click="download(proctorFile.url, proctorFile.name)">
              {{proctorFile.name}}
            </div>
            <i class="bx" :class="[proctorFile.visible ? 'bxs-show' : 'bx-hide']" @click="toggleVisible(proctorFile.id, proctorFile.name, !proctorFile.visible)" />
          </div>
        </div>
        <div v-if="!proctorFiles.length">
          No files
        </div>
        <FileInputGeneral :file.sync="fileInput" />
      </div>
    </div>
    <details>
      <summary>
        Student files
      </summary>
      <PlainButton class="mb-5" @click="downloadAll">
        Download All
      </PlainButton>
      <div v-for="[student, studentFiles] in groups" :key="studentFiles[0].studentId" class="group">
        <h2>{{student.name}} ({{student.email}})</h2>
        <div class="inner">
          <div v-for="file in studentFiles" :key="file.id">
            <div @click="download(file.url, file.name)">
              {{file.name}}
            </div>
          </div>
          <div v-if="!files.length">
            No files
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script>
import * as fileDL from 'js-file-download';
import { groupBy } from 'lodash';
import Jszip from 'jszip';

const chunkify = (inputArray, perChunk) => {
  const result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return result;
}

export default {
  props: {
    files: Array,
    examId: Number
  },
  data() {
    return {
      downloadUrl: null,
      downloadName: null,

      fileInput: null
    }
  },
  computed: {
    groups() {
      const groupsObj = groupBy(this.files, 'studentId');

      return Object.entries(groupsObj).map(([k, v]) => ([v[0].student, v])).filter(x => x[0]);
    },
    proctorFiles() {
      return this.files.filter(x => !x.studentId);
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
    async toggleVisible(id, name, visible) {
      if (!confirm(`This action will make the file "${name}" ${visible ? 'visible' : 'invisible'} to all of the students!`)) return;
      await this.$axios.$post('modify-file', {
        id,
        visible
      }, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });
      window.location.reload()
    },
    async downloadAll() {
      const makePart = async (idx) => {
        const zip = new Jszip();

        const chunks = chunkify(this.files.filter(x => x.studentId), 5)

        for (const chunk of chunks) {
          const mapped = chunk.map((file) => {
            try {
              return [
                file,
                this.$axios.$get(file.url, {
                  responseType: 'blob'
                })
              ];
            } catch (err) {
              return undefined;
            }
          }).filter(x => x);
          const batch = await Promise.all(mapped);
          for (const [file, data] of batch) {
            zip.file(`file.student.name (${file.student.email})/` + file.name, data);
          }
        }
        const data = await zip.generateAsync({type: 'blob'});

        const _url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = _url;
        link.setAttribute('download', 'test.zip');
        document.body.appendChild(link);
        link.click();
      }

      await makePart();
      // const archive = archiver('zip', {
      //   zlib: { level: 1 } // Sets the compression level.
      // });
      // const output = new WritableStream({
      //   close() {
      //     console.log('close');
      //   },
      //   start() {
      //     console.log('start');
      //   }
      // });
      // archive.pipe(output);
      // archive.finalize();
    }
  },
  watch: {
    async fileInput(n) {
      if (!n) return;
      const data = await this.$axios.$post('admin-file-url', {
        name: this.fileInput.name,
        examId: this.examId
      }, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });
      const {url} = data;
      const {fields} = data;
      const {key} = fields;

      const formData = new FormData();

      formData.append('key', fields.key);

      for (const [k, v] of Object.entries(fields).filter(([k, v]) => k !== 'key'))
        formData.append(k, v);

      formData.append('file', this.fileInput, this.fileInput.name);

      await this.$axios.$post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      window.location.reload();
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  // display: flex;
  margin: 25px 0 25px;
  & > * + * {
    margin-top: 10px;
    // margin-left: 30px;
  }
}
.inner {
  border-left: 2px solid #eee;
  // border-radius: 5px;
  margin-top: 3px;
  padding: 5px 10px;
  & > div {
    cursor: pointer;
  }
}
h1 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 3px;
}
h2 {
  font-size: .9rem;
  font-weight: 500;
  margin-bottom: 3px;
}
summary {
  margin-bottom: 10px;
  cursor: pointer;
  outline: none;
}
.proctor-file {
  @include flex-center(v);
  i {
    margin-left: 7px;
  }
}
</style>
