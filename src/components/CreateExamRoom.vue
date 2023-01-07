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

      <FileInput @load="loadCSV">
        <PlainButton>
          <IconLabel icon="bxs-file-import" @click.native="download">
            Import CSV
          </IconLabel>
        </PlainButton>
      </FileInput>

      <PlainButton v-if="!isScoresIncorrect && isUpdated" @click.native="submit">
        Merge
      </PlainButton>

    </div>

    <div style="margin-top: 20px;">
      <PlainButton>
        <IconLabel icon="bxs-file-export" @click.native="download">
          Export CSV
        </IconLabel>
      </PlainButton>
    </div>

    <!-- {{selectedStudents}} -->
    <!-- {{getUnique(selectedStudents, 'schoolRel.id')}} -->

    <div v-if="!isUpdated && room.students.length" class="file-submit-wrap" style="margin-top: 30px; display: flex; align-items: center">
      <Dropdown :opts="[['scores', 'Scores'], ['zoom', 'Zoom links']]" :val.sync="emailType" style="font-size: .8rem" />
      <SchoolEmailSelect :options="getUnique(room.students.map(x => x.student.schoolRel).filter(x => x), 'id')" :selected.sync="emailSchool" style="font-size: .8rem" />
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

    <div v-if="room.students.length" class="table-wrap">
      <!-- {{room.students}} -->
      <table>
        <thead>
          <tr>
            <th v-if="emailSchool === 'selection'" class="selection-check" />
            <th>Name</th>
            <th>School ID</th>
            <th>School Custom</th>
            <th>Present?</th>
            <th v-for="i in 2" :key="'th' + i">
              New Section {{i}}
            </th>
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
          <tr v-for="({score = {}, student, cancelled, isIncorrect}, idx) in room.students" :key="'tr' + idx" class="student-row" :class="[isIncorrect && 'incorrect', cancelled && 'cancelled']">
            <td v-if="emailSchool === 'selection'" class="selection-check">
              <input v-model="selection" type="checkbox" :value="student.id">
            </td>
            <td>
              <ExamStudentInfo
                :students="students"
                :score="score"
                :selected="student"
              />
            </td>
            <td>
              <a v-if="student.school" :href="'/schools/' + student.school.access" target="_blank">
                {{student.school.name}}
              </a>
            </td>
            <td>
              {{(student.info || {}).schoolName}}
            </td>
            <template v-if="score">
              <td>
                <i :class="['bx', score.present ? 'bx-check' : 'bx-x']" />
              </td>
              <td v-for="(_i, i) in 2" :key="'td1' + i">
                {{score.newCorrectCounts ? score.newCorrectCounts[i] : ''}}
              </td>
              <td v-for="(_i, i) in 4" :key="'td2' + i">
                {{score.correctCounts ? score.correctCounts[i] : ''}}
              </td>
              <td v-for="(_i, i) in 2" :key="'td3' + i">
                {{score.totals[i]}}
              </td>
              <td>
                {{score.totals[0] + score.totals[1]}}
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
import * as json2csv from 'json2csv';
import {format} from 'date-fns';
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
    students: null,
    roomidx: null
  },
  methods: {
    getUnique(arr, field) {
      return _.uniqBy(arr, field);
    },
    async submit() {
      if (this.isScoresIncorrect) return;
      let st = this.room.students.filter(x => x).map(x => ({student: x.student, overwrite: false}));

      // console.log(st);
      // return;
      await Promise.resolve();

      const id = this.room.id;

      const copy = [...this.room.students.map((x) => {
        return {
          newCorrectCounts: x.score.newCorrectCounts.map(x => +x),
          totals: x.score.totals.map(x => +x),
          present: x.score.present
        }
      })];

      const stReq = await this.$axios.$post('students', st, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });

      console.log(stReq);

      st = st.map(x => x.student).map((x) => {
        return stReq.find(y => y.email.toLowerCase() === x.email.toLowerCase());
      });

      // console.log(st);

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
      try {
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
      } catch (err) {
        console.log(err);
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
      const currentStudents = [...this.room.students];
      console.log(currentStudents);
      this.isUpdated = true;
      const csv = window.CSV.parse(text);
      const headers = csv[0].map(x => (x || '').trim().toLowerCase());

      const columnIdx = {
        student: {
          email: headers.findIndex(x => x.startsWith('email')),
        },
        studentSchoolId: headers.findIndex(x => x.startsWith('school id')),
        score: {
          present: headers.findIndex(x => x.startsWith('submitted')),
          newCorrectCounts: [
            headers.findIndex(x => x.startsWith('new section 1')),
            headers.findIndex(x => x.startsWith('new section 2'))
          ],
          totals: [
            headers.findIndex(x => x.startsWith('english')),
            headers.findIndex(x => x.startsWith('math'))
          ]
        },
      }
      // console.log('column indexes', columnIdx);
      const body = csv.slice(1);
      // console.log('body', body);
      this.isScoresIncorrect = false;

      const students = body.map((row) => {
        try {
          // console.log('row', row);
          // let obj = {score: {}, student: {info: {}}};
          const email = row[columnIdx.student.email];
          const obj = {...currentStudents.find(x => x.student.email === email)};
          if (!obj) return null;
          // console.log('found obj', obj);
          obj.score = obj.score || {};
          obj.student = obj.student || {};
          obj.student.info = obj.student.info || {};
          // console.log('found obj2', {...obj});

          obj.score.newCorrectCounts = columnIdx.score.newCorrectCounts.map(x => row[x] || 0);
          obj.score.totals = columnIdx.score.totals.map(x => row[x] || 0)

          obj.score.present = (row[columnIdx.score.present] || '').trim().toLowerCase() === 'true';

          if (obj.score.present) {
            for (const [k, v] of [66, 54].entries()) {
              if (obj.score.newCorrectCounts[k] > v || obj.score.newCorrectCounts[k] < 0) {
                obj.isIncorrect = true;
                this.isScoresIncorrect = true;
              }
            }

            for (const total of obj.score.totals) {
              if (total < 200 || total > 800) {
                obj.isIncorrect = true;
                this.isScoresIncorrect = true;
              }
            }
          } else {
            for (const correctCount of obj.score.newCorrectCounts)
              if (correctCount !== 0) {
                obj.isIncorrect = true;
                this.isScoresIncorrect = true;
              }

            for (const total of obj.score.totals)
              if (total !== 0) {
                obj.isIncorrect = true;
                this.isScoresIncorrect = true;
              }
          }

          // console.log('school id', row[columnIdx.studentSchoolId]);
          if (row[columnIdx.studentSchoolId]) {
            obj.student.school = {name: row[columnIdx.studentSchoolId]}
          }

          // console.log(obj);
          return obj;
        } catch (e) {
          console.log(e);
        }
      }).filter(x => x);
      this.room.students = [];

      this.$nextTick(() => {
        this.room.students = students;
      });
    },
    download() {
      const rows = this.room.students.map((x) => {
        return {
          'CANCELLED?': x.cancelled,
          'Student Name': x.student.name,
          'Student First Name': x.student.info?.name1,
          'Student Last Name': x.student.info?.name2,
          Email: x.student.email,
          'School ID': x.student.school?.name,
          'School Custom': x.student.info?.schoolName,
          'WhatsApp Number': x.student.info?.whatsapp,
          Country: x.student.info?.country,
          'Grad Year': x.student.info?.gradYear,
          'Parent First Name': x.student.info?.parent?.name1,
          'Parent Last Name': x.student.info?.parent?.name2,
          'Parent Name': x.student.info?.parent?.fullName,
          'Parent Email': x.student.info?.parent?.email,
          'Parent WhatsApp Number': x.student.info?.parent?.whatsapp,
          'Online Timestamp': format(new Date(x.student.onlineAt), 'MM/dd/y hh:mm:ss O'),
          'Submitted?': x.score?.present,
          'New Section 1': x.score?.newCorrectCounts?.[0],
          'New Section 2': x.score?.newCorrectCounts?.[1],
          'Section 1': x.score?.correctCounts?.[0],
          'Section 2': x.score?.correctCounts?.[1],
          'Section 3': x.score?.correctCounts?.[2],
          'Section 4': x.score?.correctCounts?.[3],
          English: x.score?.totals?.[0],
          Math: x.score?.totals?.[1],
          Total: x.score?.totals ? x.score.totals[0] + x.score.totals[1] : null,
          URL: `https://studywithmillie.milliegroup.com/${x.student.access}`
        }
      })

      const csv = json2csv.parse(rows, {fields: Object.keys(rows[0])});

      const a = document.createElement('a');
      a.href = 'data:application/octet-stream,' + encodeURIComponent(csv);
      a.download = this.room.name + ` - R${this.roomidx + 1}.csv`;
      a.click();
    }
  },
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

.student-row {
  &.cancelled {
    opacity: .4
  }
}
</style>
