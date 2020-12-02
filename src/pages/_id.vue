<template>
  <div v-if="student" class="page padded-container">
    <div class="logo">
      <svg viewBox="0 0 140 32">
        <title>Millie</title>
        <path d="M40.5 31.3h-7.4l-3.6-21.1-5.9 21.1H17l-6-21.1-3.6 21.1H0L5.9.7h8l6.4 21.5L26.6.7h8zM45.6.7h6.7v30.6h-6.7zm14.3 30.6V.7h6.7v24.5h11v6.1zm24.1 0V.7h6.7v24.5h10.9v6.1zM108 .7h6.7v30.6H108zm32 24.5v6.1h-17.7V.7H140v6.1h-11v6.1h10.6V19H129v6.2z" />
      </svg>
    </div>

    <h1 class="student-name">
      {{student.name}}
    </h1>
    <div v-for="exam in student.exams" :key="exam.exam.id">
      <section class="exam">
        <h2 class="exam-name">
          {{exam.exam.name}}
        </h2>
        <template v-if="exam.score">
          <table>
            <thead>
              <td>Section</td>
              <td>Correct answers</td>
            </thead>
            <tr v-for="(section, idx) in exam.score.sections" :key="idx">
              <td>
                {{section.name}}
              </td>
              <td>
                {{section.correctCount}} / {{[52, 44, 20, 28][idx]}}
              </td>
            </tr>
          </table>

          <div class="score-sum-wrap">
            <div class="score-sum">
              <h6>English score</h6>
              <em>{{exam.score.english}}</em> / 1600
            </div>
            <div class="score-sum">
              <h6>Math score</h6>
              <em>{{exam.score.math}}</em> / 1600
            </div>
            <div class="score-sum">
              <h6>Overall score</h6>
              <em>{{exam.score.overall}}</em> / 1600
            </div>
          </div>
        </template>
        <h4 v-else>
          No scores for this exam yet!
        </h4>
      </section>
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
  async fetch() {
    this.student = await this.$axios.$get(`students/${this.$route.params.id}`);
    for (const exam of this.student.exams) {
      if (exam.score) {
        exam.score.overall = exam.score.sections.reduce((acc, val) => acc + val.score, 0);
        exam.score.english = exam.score.sections[0].score + exam.score.sections[1].score;
        exam.score.math = exam.score.sections[2].score + exam.score.sections[3].score;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .exam-name {
    padding: .4em .8em;
    margin: 0 -.8em .8em;
    border-radius: 5px;
    background: #fb6c30;
    color: white;
  }
  .exam {
    margin-top: 50px;
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
    font-weight: 300;

    h6 {
      font-size: 1.3rem;
      font-weight: 500;
      margin-bottom: -2px;
    }
    em {
      font-style: normal;
      color: #fb6c30;
      font-weight: 600;
    }
  }
  .student-name {
    margin-bottom: -20px;
  }
  .score-sum-wrap {
    display: flex;
    justify-content: space-between;

    @media (max-width: 825px) {
      flex-direction: column;
    }
  }
</style>
