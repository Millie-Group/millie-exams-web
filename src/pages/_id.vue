<template>
  <div>
    <div v-if="student" class="page padded-container">
      <Logo />
      <!-- {{student}} -->
      <h1 class="student-name">
        {{student.name}}
      </h1>
      <Hint style="margin: 10px 0 0px; font-size: 1.1rem">
        <a href="/static/FAQ.pdf" target="_blank" style="text-decoration: underline; cursor: pointer">
          FAQ
        </a>
      </Hint>
      <Hint style="margin: 10px 0 0px; font-size: 1.1rem" icon="bx-task">
        <a href="https://www.studywithmillie.com/services/p/sat-review" target="_blank" style="text-decoration: underline; cursor: pointer">
          Get a 1:1 SAT Diagnostic Review
        </a>
      </Hint>
      <Hint style="margin: 10px 0 0px; font-size: 1.1rem" icon="bxl-instagram-alt">
        <a href="https://www.instagram.com/millie_group/" target="_blank" style="text-decoration: underline; cursor: pointer">
          Follow us on Instagram
        </a>
      </Hint>
      <Hint style="margin: 10px 0 -20px; font-size: 1.1rem" icon="bx-world">
        <a href="https://www.milliegroup.com/" target="_blank" style="text-decoration: underline; cursor: pointer">
          Millie Website
        </a>
      </Hint>
      <SignUpExisting />
      <div v-for="exam in filteredExams" :key="exam.exam.id" class="relative">
        <section class="exam" :class="[exam.cancelled && 'cancelled']">
          <div class="exam-name">
            <div>
              {{exam.exam.name}}
            </div>
            <button v-if="!exam.cancelled && exam.exam.state === 'about-to-start'" class=" cancel-btn" @click="cancel(exam.exam.id)">
              <IconLabel icon="bxs-calendar-x">
                Cancel attendance
              </IconLabel>
            </button>
          </div>
          <h3>
            <b style="font-weight: 500">
              Status:
            </b>
            {{statusMsg(exam.exam)}}
          </h3>
          <StudentPageFiles :files="exam.exam.files" :show-upload="exam.exam.state === 'in-progress'" :exam-id="exam.exam.id" />
          <div v-if="!exam.exam.state || exam.exam.state === 'scored'">
            <template v-if="exam.score && exam.score.present">
              <table>
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Correct answers</th>
                  </tr>
                </thead>
                <tbody v-if="exam.score.newCorrectCounts">
                  <tr v-for="(count, idx) in exam.score.newCorrectCounts" :key="idx">
                    <td>
                      {{
                        [
                          'Section 1: Reading and Writing',
                          'Section 2: Math',
                        ][idx]
                      }}
                    </td>
                    <td>
                      {{count}} / {{[66, 54][idx]}}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(count, idx) in exam.score.correctCounts" :key="idx">
                    <td>
                      {{
                        [
                          'Section 1: Reading',
                          'Section 2: Writing',
                          'Section 3: Math No Calculator',
                          'Section 4: Math Calculator'
                        ][idx]
                      }}
                    </td>
                    <td>
                      {{count}} / {{[52, 44, 20, 38][idx]}}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="score-sum-wrap">
                <div class="score-sum">
                  <h6>English score</h6>
                  <em>{{exam.score.totals[0]}}</em> / 800
                </div>
                <div class="score-sum">
                  <h6>Math score</h6>
                  <em>{{exam.score.totals[1]}}</em> / 800
                </div>
                <div class="score-sum">
                  <h6>Overall score</h6>
                  <em>{{exam.score.totals[0] + exam.score.totals[1]}}</em><span> / 1600</span>
                </div>
              </div>
            </template>
            <h4 v-else style="margin-top: 15px">
              You missed the exam. Need help? Reach out to us at studywithmillie@milliegroup.com
            </h4>
          </div>
          <ExamPlace v-if="!exam.exam.state || exam.exam.state === 'scored'" :place="exam.place" />
        </section>
        <div v-if="exam.cancelled" class="cancel-text bg-white bg-opacity-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 shadow-lg border-black border-2 rounded">
          <h1 class="w-500" style="font-size: 24px; line-height: 32px; text-align: center">
            CANCELLED
          </h1>
          <h2 style="margin-top: 16px;">
            You have cancelled your attendance in this exam
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderBy } from 'lodash';
export default {
  data() {
    return {
      student: null,
      refreshInterval: null
    }
  },
  methods: {
    async refresh(progress = false) {
      try {
        if (this.$route.params.id)
          this.student = await this.$axios.$get(`students/${this.$route.params.id}`, {
            progress
          });
      } catch (err) {
        clearInterval(this.refreshInterval);
        throw err;
      }
    },
    statusMsg(exam) {
      return {
        'about-to-start': 'The exam hasn\'t started yet',
        'in-progress': 'The exam is in progress',
        finished: 'The exam has finished',
        scored: 'The exam has been scored'
      }[exam.state] || 'The exam has been scored'
    },
    async cancel(exam) {
      if (!confirm('Are you sure you want to cancel your attendance in this exam?')) return;
      await this.$axios.$post('exam-cancellation', {
        student: this.student.id,
        exam
      });
      this.refresh();
    }
  },
  computed: {
    filteredExams() {
      const exams = this.student?.exams.filter(x => new Date(x.exam.date) >= new Date('2023-01-01')) || [];
      const sortByDate = arr => orderBy(arr, ['exam.date'], ['desc']);
      const inProgress = exams.filter(x => x.exam.state === 'in-progress');
      if (inProgress.length)
        return sortByDate(inProgress);

      return sortByDate(exams);
    }
  },
  mounted() {
    this.refresh(true);
    this.refreshInterval = setInterval(this.refresh, 30000);
  },
  destroyed() {
    clearInterval(this.refreshInterval);
  }
}
</script>

<style lang="scss" scoped>
  .exam-name {
    padding: .4em .8em;
    margin: 0 0 .8em;
    border-radius: 5px;
    background: #061a33;
    color: white;
    font-size: 1.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .exam {
    margin-top: 50px;
    // overflow-x: auto;
    width: 100%;

    &.cancelled {
      opacity: .3;
      pointer-events: none;
    }
  }
  .page {
    margin-top: 10px;
  }
  table {
    border-collapse: collapse;
  }
  tr {
    & > td {
      padding: .5em 0;
    }
    font-size: 1.3rem;

    border-bottom: 1px solid #ccc;
  }
  thead {
    font-weight: 500;

    border-bottom: 1px solid #ccc;

    th {
      font-size: 1rem;
      font-weight: 500;
      z-index: 99999;
    }
  }
  tr, thead {
    & > *:nth-child(1) {
      width: 99%;
      padding-right: 15px;
    }
    & > *:nth-child(2) {
      text-align: right;
      white-space: nowrap;
    }
  }
  .logo {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }
  svg {
    height: 30px;
  }
  .score-sum {
    margin-top: 30px;
    font-size: 2.5rem;
    text-align: center;
    font-weight: 400;

    h6 {
      font-size: 1.3rem;
      font-weight: 400;
      margin-bottom: 10px;
    }
    em {
      font-style: normal;
      color: #061a33;
      font-weight: 600;
    }
    // span {
    //   font-size: .7em;
    // }
  }
  .student-name {
    // margin-bottom: -20px;
    font-size: 1.7rem;
    font-weight: 500;
  }
  .score-sum-wrap {
    display: flex;
    justify-content: space-between;

    @media (max-width: 825px) {
      flex-direction: column;
    }
  }
  .cancel-btn {
    background: white;
    color: black;
    padding: 4px 12px;
    border-radius: 5px;
  }
  .cancel-text {
    background: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 16px 32px;
    shadow: 0 0 10px rgba(0, 0, 0, .3);
    border: 2px solid black;
    border-radius: 5px;
  }
</style>
