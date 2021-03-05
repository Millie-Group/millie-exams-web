<template>
  <div class="wide-padded-container">
    <Logo />
    <BackButton />
    <DeleteExam :exam-id="+$route.query.edit" />
    <div class="name-input-wrap">
      <!-- <h1>Examination session name</h1> -->
      <TextInput :val.sync="name" placeholder="Name" />
      <date-picker v-model="date" type="datetime" />
      <button v-if="isUpdated" class="submit-btn" @click="submit">
        {{edit ? 'Update' : 'Create'}}
      </button>
    </div>

    <div v-if="edit">
      Sign up link (auto-distribute students to rooms): https://studywithmillie.milliegroup.com/signup?exam={{edit}}
      <br>
    </div>

    <!-- {{rooms}} -->
    <details v-for="(room, idx) in rooms" :key="room.id">
      <summary>Room {{idx + 1}}</summary>
      <CreateExamRoom :students="students" :room.sync="rooms[idx]" :roomidx="idx" />
    </details>

    <PlainButton v-if="edit" style="margin-top: 50px" @click.native="addRoom">
      <IconLabel icon="bx-plus">
        Create Room
      </IconLabel>
    </PlainButton>
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
      students: [],
      edit: this.$route.query.edit,
      isUpdated: false,
      rooms: []
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
          this.name = data.name;
          this.date = new Date(data.date);
          this.rooms = data.rooms.map((x) => {
            const selectedStudents = x.students.map(x => x.student).map(x => ({...x, school: x.school?.name, schoolRel: x.school}));
            return {
              ...x,
              selectedStudents,
              studentsLength: selectedStudents.length + 1,
              scores: x.students.map(x => x.score),
              students: x.students.map(x => ({...x, student: {...x.student, school: x.student.school?.name, schoolRel: x.student.school}})),
              meta: x.meta || {}
            }
          })
        });
      }
    },
    async submit() {
      let id = null;

      if (!this.edit) {
        id = (await this.$axios.$post('exams', {
          name: this.name,
          date: this.date,
          state: 'about-to-start'
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        })).id;
        await this.$router.replace(`create-exam?edit=${id}`);
        window.location.reload();
      } else {
        id = (await this.$axios.$put(`exams/${this.edit}`, {
          name: this.name,
          date: this.date
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        })).id;

        await this.$router.replace(`create-exam?edit=${id}`);
        window.location.reload();
      }
    },
    async sendEmails() {
      if (!this.emailSchool) return;
      const confirmed = window.confirm('Are you sure you want to send bulk emails?');
      if (!confirmed) return;
      // console.log(this.emailSchool);

      const sendEmailsToSchool = async (id) => {
        const result = await this.$axios.$post('send-emails', {
          school: id || undefined,
          exam: this.edit,
          selection: this.id ? undefined : this.selection,
          force: this.forceSend ? 'true' : 'false'
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        });
        return result;
      }

      for (const school of
        this.emailSchool === 'all'
          ? this.getUnique(this.selectedStudents.map(x => x.schoolRel).filter(x => x), 'id').map(x => x.id)
          : (
            this.emailSchool === 'selection'
              ? [null]
              : [this.emailSchool]
          )
      ) {
      // eslint-disable-next-line no-labels
        inner:
        while (true) {
          // eslint-disable-next-line no-labels
          if (await sendEmailsToSchool(school) !== 'continue' || this.forceSend) break inner;
        }
      }

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
      this.selectedStudents = [];
      this.studentsLength = 0;

      this.$nextTick(() => {
        this.scores = scores;
        this.selectedStudents = [...students];
        this.studentsLength = students.length + 1;
      });
    },
    async addRoom() {
      await this.$axios.$post(`exams/${this.edit}/addroom`, {}, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });
      window.location.reload();
    }
  },
  watch: {
    // studentsLength: {
    //   immediate: true,
    //   handler(n) {
    //     for (const i of Array(n).keys())
    //       this.scores[i] = this.scores[i] || {
    //         correctCounts: [],
    //         totals: []
    //       };
    //     this.scores = [...this.scores];
    //   }
    // },
    // scores: {
    //   deep: true,
    //   handler(n) {
    //     // const copy = [...this.scores];
    //     // for (const studentsScores of copy) {
    //     //   for (const section of studentsScores.sections) {
    //     //     section.correctCount = +section.correctCount;
    //     //     section.score = +section.score;
    //     //   }
    //     // }
    //     // this.scores = [...copy];
    //   }
    // },
    name(n, o) {
      if (o?.length === 0 && n?.length)
        this.isUpdated = true
    },
    date(n, o) {
      // if (o !== null)
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
  align-items: flex-start;

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
  font-size: 1.2rem;
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

summary {
  outline: none;
  cursor: pointer;
  // margin-top: 20px;
  margin-bottom: 10px;
}

details {
  padding: 20px;
  margin: -20px;
  margin-top: 20px;
  &[open] {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    // transition: box-shadow .2s ease-in-out;
  }
}
</style>
