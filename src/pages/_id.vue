<template>
  <div>
    <div v-if="student" class="page padded-container">
      <Logo />
      <!-- {{student}} -->
      <h1 class="student-name">
        {{student.name}}
      </h1>
      <SignUpExisting />
      <div v-for="exam in student.exams" :key="exam.exam.id">
        <section class="exam">
          <h2 class="exam-name">
            {{exam.exam.name}}
          </h2>
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
                <tbody>
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
                      {{count}} / {{[52, 44, 20, 28][idx]}}
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
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      student: null
    }
  },
  methods: {
    statusMsg(exam) {
      return {
        'about-to-start': 'The exam hasn\'t started yet',
        'in-progress': 'The exam is in progress',
        finished: 'The exam has finished',
        scored: 'The exam has been scored'
      }[exam.state] || 'The exam has been scored'
    }
  },
  async mounted() {
    // console.log(this.$route.params);
    if (this.$route.params.id)
      this.student = await this.$axios.$get(`students/${this.$route.params.id}`);
  }
}
</script>

<style lang="scss" scoped>
  .exam-name {
    padding: .4em .8em;
    margin: 0 0 .8em;
    border-radius: 5px;
    background: #fb6c30;
    color: white;
    font-size: 1.3rem;
  }
  .exam {
    margin-top: 50px;
    overflow-x: auto;
    width: 100%;
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
    font-size: 3rem;
    text-align: center;
    font-weight: 400;

    h6 {
      font-size: 1.3rem;
      font-weight: 400;
      // margin-bottom: -2px;
    }
    em {
      font-style: normal;
      color: #fb6c30;
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
</style>
