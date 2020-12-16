<template>
  <div class="wide-padded-container">
    <Logo />
    <BackButton />
    <div class="name-input-wrap">
      <!-- <h1>Examination session name</h1> -->
      <TextInput :val.sync="name" placeholder="Name" />
      <date-picker v-model="date" type="datetime" />
    </div>

    <div class="file-submit-wrap">

      <FileInput @load="loadCSV" />

      <button v-if="selectedStudents.length && !isScoresIncorrect && isUpdated" class="submit-btn" @click="submit">
        <template v-if="!edit">
          Create
        </template>
        <template v-else>
          Update
        </template>
      </button>

    </div>

    <!-- {{selectedStudents}} -->
    <!-- {{getUnique(selectedStudents, 'schoolRel.id')}} -->

    <div v-if="!isUpdated && selectedStudents.length" class="file-submit-wrap" style="margin-top: 30px;">
      <SchoolEmailSelect :options="getUnique(selectedStudents.map(x => x.schoolRel).filter(x => x), 'id')" :selected.sync="emailSchool" />
      <button class="submit-btn" @click="sendEmails">
        Send emails
      </button>
    </div>

    <div v-if="selectedStudents.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>School</th>
            <th>Present?</th>
            <th v-for="i in 4" :key="'th' + i">
              Section {{i}}
            </th>
            <th>
              English
            </th>
            <th>
              Math
            </th>
            <th>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="idx in selectedStudents.length" :key="'tr' + idx" class="student-row" :class="[scores[idx-1].isIncorrect && 'incorrect']">
            <td>
              <ExamStudentInfo
                :students="students"
                :score="scores[idx-1]"
                :selected.sync="selectedStudents[idx-1]"
              />
            </td>
            <td><a v-if="selectedStudents[idx-1].schoolRel" :href="'/schools/' + selectedStudents[idx-1].schoolRel.access" target="_blank">{{selectedStudents[idx-1].school}}</a><span v-else>{{selectedStudents[idx-1].school}}</span></td>
            <td>
              <i :class="['bx', scores[idx-1].present ? 'bx-check' : 'bx-x']" />
            </td>
            <td v-for="i in 4" :key="'td1' + i">
              {{scores[idx-1].correctCounts[i-1]}}
            </td>
            <td v-for="i in 2" :key="'td2' + i">
              {{scores[idx-1].totals[i-1]}}
            </td>
            <td>
              {{scores[idx-1].totals[0] + scores[idx-1].totals[1]}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <ExamStudentSelect
      v-for="idx in studentsLength"
      :key="idx"
      :students="students"
      :selected.sync="selectedStudents[idx-1]"
    /> -->
  </div>
</template>

<script>
import * as _ from 'lodash';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
export default {
  components: { DatePicker },
  data() {
    return {
      name: '',
      date: null,
      email: '',
      students: [],
      selectedStudents: [],
      studentsLength: 1,
      scores: [],
      isScoresIncorrect: false,
      edit: this.$route.query.edit,
      emailSchool: null,
      isUpdated: false
    }
  },
  async mounted() {
    this.students = await this.$axios.$get('students', {
      headers: {
        Authorization: 'Bearer ' + this.$store.state.auth.pw
      }
    });
    this.fetchEdit();
    // this.fetchEdit();
  },
  methods: {
    getUnique(arr, field) {
      return _.uniqBy(arr, field);
    },
    async fetchEdit() {
      if (this.$route.query.edit) {
        const data = await this.$axios.$get(`exams/${this.$route.query.edit}`, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        });

        this.selectedStudents = [];
        this.studentsLength = 0;

        this.$nextTick(() => {
          this.selectedStudents = data.students.map(x => x.student).map(x => ({...x, school: x.school?.name, schoolRel: x.school}));
          this.studentsLength = this.selectedStudents.length + 1;
          this.scores = data.students.map(x => x.score);
          this.name = data.name;
          this.date = new Date(data.date);
        });
      }
    },
    async submit() {
      if (this.isScoresIncorrect) return;

      let st = this.selectedStudents.filter(x => x);

      const {id} = this.edit
        ? await this.$axios.$put(`exams/${this.edit}`, {
          name: this.name,
          date: this.date
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        })
        : await this.$axios.$post('exams', {
          name: this.name,
          date: this.date
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        });

      const copy = [...this.scores];
      for (const studentsScores of copy) {
        studentsScores.correctCounts = studentsScores.correctCounts.map(x => +x);
        studentsScores.totals = studentsScores.totals.map(x => +x);
      }

      const stReq = await this.$axios.$post('students', st, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });

      st = st.map((x) => {
        return stReq.find(y => y.email === x.email);
      });

      await this.$axios.$post(`exams/${id}/students`, st.map(x => x.id), {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });

      await this.$axios.$put(`exams/${id}/scores`, Object.entries(st).map(([k, v]) => ({student: v.id, score: copy[k]})), {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });

      if (this.edit) {
        window.location.reload(true);
      } else {
        await this.$router.replace(`create-exam?edit=${id}`);
        window.location.reload(true);
      }
    },
    async sendEmails() {
      if (!this.emailSchool) return;
      const confirmed = window.confirm('Are you sure you want to send bulk emails?');
      if (!confirmed) return;
      // console.log(this.emailSchool);

      await this.$axios.$post('send-emails', {school: this.emailSchool, exam: this.edit}, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });

      window.location.reload(true);
    },
    loadCSV(text) {
      this.isUpdated = true;
      const csv = window.CSV.parse(text);
      const headers = csv[0].map(x => x.trim().toLowerCase());

      const columnIdx = {
        present: headers.findIndex(x => x.startsWith('present')),
        email: headers.findIndex(x => x.startsWith('email')),
        name: headers.findIndex(x => x.startsWith('student name')),
        school: headers.findIndex(x => x.startsWith('school id')),
        correctCounts: [
          headers.findIndex(x => x.startsWith('section 1')),
          headers.findIndex(x => x.startsWith('section 2')),
          headers.findIndex(x => x.startsWith('section 3')),
          headers.findIndex(x => x.startsWith('section 4'))
        ],
        totals: [
          headers.findIndex(x => x.startsWith('english')),
          headers.findIndex(x => x.startsWith('math'))
        ]
      }
      const body = csv.slice(1);
      const students = body.map((row) => {
        const obj = {};
        for (const [name, idx] of Object.entries(columnIdx)) {
          if (Array.isArray(idx) || ['school', 'present'].includes(name)) continue;
          obj[name] = row[idx]
        }
        if (row[columnIdx.school]) {
          obj.school = '' + row[columnIdx.school];
        }
        return obj;
      });
      this.isScoresIncorrect = false;
      const scores = body.map((row) => {
        const obj = {};

        obj.correctCounts = columnIdx.correctCounts.map(x => row[x] || 0);
        obj.totals = columnIdx.totals.map(x => row[x] || 0)

        // console.log()

        if (['yes', 'true', 'y'].includes(row[columnIdx.present].toLowerCase()))
          obj.present = true;
        else if (['no', 'false', 'n'].includes(row[columnIdx.present].toLowerCase()))
          obj.present = false;
        else throw new Error('Incorrect CSV data for the "Present?" column');

        if (obj.present) {
          for (const [k, v] of [52, 44, 20, 38].entries()) {
            // console.log(k, v, obj.correctCounts[k]);
            if (obj.correctCounts[k] > v || obj.correctCounts[k] < 0) {
              obj.isIncorrect = true;
              this.isScoresIncorrect = true;
            }
          }

          for (const total of obj.totals) {
            if (total < 200 || total > 800) {
              obj.isIncorrect = true;
              this.isScoresIncorrect = true;
            }
          }
        } else {
          for (const correctCount of obj.correctCounts)
            if (correctCount !== 0) {
              obj.isIncorrect = true;
              this.isScoresIncorrect = true;
            }

          for (const total of obj.totals)
            if (total !== 0) {
              obj.isIncorrect = true;
              this.isScoresIncorrect = true;
            }
        }
        return obj;
      });
      this.selectedStudents = [];
      this.studentsLength = 0;

      this.$nextTick(() => {
        this.scores = scores;
        this.selectedStudents = [...students];
        this.studentsLength = students.length + 1;
      });
    }
  },
  watch: {
    studentsLength: {
      immediate: true,
      handler(n) {
        for (const i of Array(n).keys())
          this.scores[i] = this.scores[i] || {
            correctCounts: [],
            totals: []
          };
        this.scores = [...this.scores];
      }
    },
    scores: {
      deep: true,
      handler(n) {
        // const copy = [...this.scores];
        // for (const studentsScores of copy) {
        //   for (const section of studentsScores.sections) {
        //     section.correctCount = +section.correctCount;
        //     section.score = +section.score;
        //   }
        // }
        // this.scores = [...copy];
      }
    },
    name(n, o) {
      if (o)
        this.isUpdated = true
    },
    date(n, o) {
      if (o)
        this.isUpdated = true
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrap {
  margin: 0 -.7em;
  width: calc(100% + 1.4em);
  overflow-x: auto;
}
table {
  position: relative;
  margin-top: 30px;
  width: 100%;
  // width: calc(100% + 1.4em);
  td {
    padding: .5em .6em;
    vertical-align: middle;
    min-width: 90px;
  }
  th {
    padding: .3em .6em;
    z-index: 999;
  }
  td, th {
    &:nth-child(1) {
      width: 99%;
      padding-left: .7em;
    }
    &:nth-last-child(1) {
      padding-right: .7em;
    }
    &:nth-child(2) {
      white-space: nowrap;
    }
  }
  thead {
    color: white;
    tr {
      height: 32px;
      th {
        color: #ff4b00;
        background: #fff4f0;
        font-weight: 500;
        position: sticky;
        top: 0;
      }
      &:nth-child(1) th {
        font-weight: 500;
        position: sticky;
        top: 0;
        padding-top: .6em;
        padding-bottom: .6em;
      }
      // &:nth-child(2) th {
      //   font-weight: 500;
      //   position: sticky;
      //   top: 32px;
      // }
      &:nth-child(1) th:nth-child(1) {
        border-top-left-radius: 5px;
      }
      &:nth-child(1) th:nth-last-child(1) {
        border-top-right-radius: 5px;
      }
      &:nth-last-child(1) th:nth-child(1) {
        border-bottom-left-radius: 5px;
      }
      &:nth-last-child(1) th:nth-last-child(1) {
        border-bottom-right-radius: 5px;
      }
    }
  }
  tbody tr {
    &:nth-child(even) {
      background: #f7f7f7;
    }
  }
  max-width: 100%;
  ::v-deep input {
    max-width: 70px;
    padding-left: .2em;
    padding-right: .2em;
  }
}
.name-input-wrap {
  margin-bottom: 30px;
  // margin-top: 50px;
  display: flex;
  align-items: stretch;

  & > * + * {
    margin-left: 15px;
    z-index: 99999999999999999;
  }
  ::v-deep input {
    padding: .3em .4em;
  }
}
h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.submit-btn {
  @include flex-center(v);
  border-radius: 5px;
  font-weight: 500;
  font-size: 1.3rem;
  color: #ff4b00;
  background: transparentize($color: #ff4b00, $amount: .94);
  padding: .3em .6em;
  // margin-top: 20px;
  // margin-bottom: 30px;
  margin-left: 15px;
}

.file-submit-wrap {
  @include flex-center(v);
}

.incorrect {
  background: #ff5100 !important;
  color: white !important;
}
</style>
