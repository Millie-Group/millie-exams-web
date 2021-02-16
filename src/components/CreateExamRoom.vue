<template>
  <div>
    <div style="margin-bottom: 20px;">
      Sign up link (for this specific room): https://studywithmillie.milliegroup.com/signup?exam={{room.id}}
      <br>
    </div>

    <ZoomLinkInput :exam-id="room.id" :zoom.sync="room.meta.zoom" />

    <ExamState :state="room.state" :exam-id="room.id" />

    <ExamPageFiles :files="room.ExamFile" :exam-id="room.id" />

    <div class="file-submit-wrap">

      <FileInput @load="loadCSV" />

      <button v-if="!isScoresIncorrect && isUpdated" class="submit-btn" @click="submit">
        Update
      </button>

    </div>

    <!-- {{selectedStudents}} -->
    <!-- {{getUnique(selectedStudents, 'schoolRel.id')}} -->

    <div v-if="!isUpdated && room.selectedStudents.length" class="file-submit-wrap" style="margin-top: 30px; display: flex; align-items: center">
      <Dropdown :opts="[['scores', 'Scores'], ['zoom', 'Zoom links']]" :val.sync="emailType" style="font-size: .8rem" />
      <SchoolEmailSelect :options="getUnique(room.selectedStudents.map(x => x.schoolRel).filter(x => x), 'id')" :selected.sync="emailSchool" style="font-size: .8rem" />
      <label v-if="emailType === 'scores'">
        <input v-model="forceSend" type="checkbox" style="margin-right: 5px">
        Force Send to All
      </label>
      <button class="submit-btn" @click="sendEmails">
        Send emails
      </button>
    </div>

    <!-- {{room.scores[0].isIncorrect}}
     -->

    <div v-if="room.selectedStudents.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-if="emailSchool === 'selection'" class="selection-check" />
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
          <tr v-for="(_, idx) in room.selectedStudents.length" :key="'tr' + idx" class="student-row" :class="[(room.scores[idx] || {}).isIncorrect && 'incorrect']">
            <td v-if="emailSchool === 'selection'" class="selection-check">
              <input v-model="selection" type="checkbox" :value="room.selectedStudents[idx].id">
            </td>
            <td>
              <ExamStudentInfo
                :students="students"
                :score="room.scores[idx]"
                :selected="room.selectedStudents[idx]"
              />
            </td>
            <template v-if="room.scores[idx]">
              <td><a v-if="room.selectedStudents[idx].schoolRel" :href="'/schools/' + room.selectedStudents[idx].schoolRel.access" target="_blank">{{room.selectedStudents[idx].school}}</a><span v-else>{{room.selectedStudents[idx].school || '*' + (room.selectedStudents[idx].info || {}).schoolName + '*'}}</span></td>
              <td>
                <i :class="['bx', room.scores[idx].present ? 'bx-check' : 'bx-x']" />
              </td>
              <td v-for="(_i, i) in 4" :key="'td1' + i">
                {{room.scores[idx].correctCounts[i]}}
              </td>
              <td v-for="(_i, i) in 2" :key="'td2' + i">
                {{room.scores[idx].totals[i]}}
              </td>
              <td>
                {{room.scores[idx].totals[0] + room.scores[idx].totals[1]}}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
export default {
  data() {
    return {
      email: '',
      selectedStudents: [],
      studentsLength: 1,
      scores: [],
      isScoresIncorrect: false,
      emailSchool: null,
      emailType: 'scores',
      isUpdated: false,
      files: [],
      state: null,
      selection: [],
      forceSend: false
    }
  },
  props: {
    room: null,
    students: null
  },
  methods: {
    getUnique(arr, field) {
      return _.uniqBy(arr, field);
    },
    async submit() {
      if (this.isScoresIncorrect) return;

      let st = this.room.selectedStudents.filter(x => x);

      const id = this.room.id;

      const copy = [...this.room.scores];
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

      window.location.reload();
    },
    async sendEmails() {
      if (!this.emailSchool) return;
      const confirmed = window.confirm('Are you sure you want to send bulk emails?');
      if (!confirmed) return;
      // console.log(this.emailSchool);

      const sendEmailsToSchool = async (selection, page) => {
        const result = await this.$axios.$post('send-emails', {
          exam: this.room.id,
          selection,
          force: this.forceSend ? 'true' : 'false',
          page,
          type: this.emailType
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          },
          timeout: 1000 * 300
        });
        return result;
      }

      // for (const school of
      //   this.emailSchool === 'all'
      //     ? this.getUnique(this.room.selectedStudents.map(x => x.schoolRel).filter(x => x), 'id').map(x => x.id)
      //     : (
      //       this.emailSchool === 'selection'
      //         ? [null]
      //         : [this.emailSchool]
      //     )
      // ) {
      // }

      let studentIds = [];
      let page = 1;
      while (true) {
        const selection = this.emailSchool === 'all'
          ? this.room.selectedStudents.map(x => x.id)
          : (
            this.emailSchool === 'selection'
              ? this.selection
              : this.room.selectedStudents.filter(x => x.schoolRel).filter(x => x.schoolRel.id === this.emailSchool)
          );
        const data = await sendEmailsToSchool(selection, page)

        if (!data.length) break;

        studentIds = [...studentIds, data];
        page++;
      }

      if (this.emailType === 'scores')
        await this.$axios.$post('/update-after-emails', {
          studentIds,
          examId: this.room.id
        })

      window.location.reload();
      // console.log('finish');
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

        if (['yes', 'true', 'y'].includes((row[columnIdx.present] || '').toLowerCase().trim()))
          obj.present = true;
        else if (['no', 'false', 'n', ''].includes((row[columnIdx.present] || '').toLowerCase().trim()))
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
      this.room.selectedStudents = [];
      this.room.studentsLength = 0;

      this.$nextTick(() => {
        this.room.scores = scores;
        this.room.selectedStudents = [...students];
        this.room.studentsLength = students.length + 1;
      });
    }
  },
  watch: {
    'room.studentsLength': {
      immediate: true,
      handler(n) {
        const scores = [];
        for (const i of Array(n).keys())
          scores[i] = this.room.scores[i] || {
            correctCounts: [],
            totals: []
          };
        this.$emit('update:room', {...this.room, scores});
      }
    },
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
  // margin-left: 15px;
}

.file-submit-wrap {
  @include flex-center(v);

  & > * + * {
    margin-left: 15px;
  }
}

.incorrect {
  background: #ff5100 !important;
  color: white !important;
}

.selection-check {
  width: 10px!important;
  max-width: 10px;
  min-width: 10px;
}
</style>
