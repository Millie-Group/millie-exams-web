<template>
  <div>
    <!-- {{school}}
    {{exams}} -->
    <div class="page wide-padded-container">
      <Logo />
      <h1 class="school-name">
        {{school.name}}
      </h1>
      <div v-for="exam in exams" :key="exam.id">
        <section class="exam">
          <h2 class="exam-name">
            {{exam.name}}
          </h2>

          <div v-if="true" class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in exam.students" :key="student.id" class="student-row">
                  <td>
                    {{student.student.name}}
                  </td>
                  <td>
                    <i :class="['bx', student.score.present ? 'bx-check' : 'bx-x']" />
                  </td>
                  <td v-for="i in 4" :key="'td1' + i">
                    {{student.score.correctCounts[i-1]}}
                  </td>
                  <td v-for="i in 2" :key="'td2' + i">
                    {{student.score.totals[i-1]}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';

export default {
  data() {
    return {
      school: null,
      exams: null
    }
  },
  async fetch() {
    // console.log(this.$route.params);
    const [school, exams] = await this.$axios.$get(`schools/${this.$route.params.id}`);
    this.school = school;
    this.exams = exams.map(x => ({...x, students: _.sortBy(x.students, ['score.present', 'student.name']).reverse()}));
  },
  // methods: {
  //   sorted() {

  //   }
  // }
}
</script>

<style lang="scss" scoped>
.exam-name {
  padding: .4em .8em;
  margin: 0 -.8em .8em;
  border-radius: 5px;
  background: #fb6c30;
  color: white;
  font-size: 1.3rem;
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

  th {
    font-size: 1rem;
    font-weight: 500;
  }
}
tr, thead {
  & > *:nth-child(1) {
    width: 99%;
    padding-right: 15px;
  }
  & > *:nth-child(2) {
    text-align: center;
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
.school-name {
  margin-bottom: -20px;
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

.table-wrap {
  margin: 0 -.7em;
}
table {
  position: relative;
  margin-top: 30px;
  width: 100%;
  i {
    font-size: 1.5rem;
    // margin-bottom: -5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  // width: calc(100% + 1.4em);
  td {
    padding: .5em .6em;
    vertical-align: middle;
    min-width: 90px;
    position: relative;
  }
  th {
    padding: .3em .6em;
    z-index: 99999;
  }
  td, th {
    &:nth-child(1) {
      width: 99%;
      padding-left: .7em;
    }
    &:nth-last-child(1) {
      padding-right: .7em;
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
}
</style>
