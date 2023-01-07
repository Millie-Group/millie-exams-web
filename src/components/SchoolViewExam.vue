<template>
  <div>
    <SchoolLeaderboardsPopup :open.sync="isLBOpen" :exam="exam" />

    <section class="exam">
      <h2 class="exam-name flex justify-between items-center">
        <div>
          {{exam.name}}
        </div>
        <button class="bg-white text-black px-3 py-1 rounded" @click="isLBOpen = true">
          <IconLabel icon="bxs-trophy">
            See the leaderboard
          </IconLabel>
        </button>
      </h2>

      <div v-if="true" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Present?</th>
              <template v-if="exam.students.filter(x => x.score.correctCounts).length">
                <th v-for="i in 4" :key="'th' + i">
                  Section {{i}}
                </th>
              </template>
              <template v-else>
                <th>
                  Section 1
                </th>
                <th />
                <th>
                  Section 2
                </th>
                <th />
              </template>
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
            <tr v-for="student in exam.students.filter(x => x.score)" :key="student.id" class="student-row">
              <td>
                <nuxt-link :to="'/' + student.student.access">
                  {{student.student.name}}
                </nuxt-link>
              </td>
              <td>
                <i :class="['bx', student.score && student.score.present ? 'bx-check' : 'bx-x']" />
              </td>
              <template v-if="student.score.newCorrectCounts">
                <td>
                  {{student.score.newCorrectCounts[0]}}
                </td>
                <td />
                <td>
                  {{student.score.newCorrectCounts[1]}}
                </td>
                <td />
              </template>
              <template v-else>
                <td v-for="i in 4" :key="'td1' + i">
                  {{student.score.correctCounts[i-1]}}
                </td>
              </template>
              <td v-for="i in 2" :key="'td2' + i">
                {{student.score.totals[i-1]}}
              </td>
              <td>
                {{student.score.totals[0] + student.score.totals[1]}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    exam: null
  },
  data() {
    return {
      isLBOpen: false
    }
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
}
.exam {
  margin-top: 50px;
  // overflow-x: auto;
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
    font-size: 0.95rem;
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
    color: #061a33;
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
  margin: 0 0;
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
        color: #061a33;
        background: #eaeff6;
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
