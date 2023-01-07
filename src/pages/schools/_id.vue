<template>
  <div>
    <!-- {{exams}}<br><br><br>
    {{sorted}} -->
    <div v-if="school">
      <!-- {{school}}
      {{exams}} -->
      <div class="page wide-padded-container">
        <Logo />
        <h1 class="school-name">
          {{school.name}}
        </h1>
        <div v-if="exams.length">
          <SchoolViewExam v-for="exam in sorted" :key="exam.id" :exam="exam" />
        </div>
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
      exams: [],
      isLBOpen: false
    }
  },
  async mounted() {
    // console.log(this.$route.params);
    const [school, exams] = await this.$axios.$get(`schools/${this.$route.params.id}`);
    this.school = school;
    this.exams = exams.map(x => ({...x, students: _.orderBy(x.students, ['score.present', 'student.name'], ['desc', 'asc'])}))
      .filter(x => x.state === 'scored');
    console.log(this.exams);
  },
  computed: {
    sorted() {
      console.log('computed, exams', this.exams);
      if (!this.exams.length) return [];
      console.log('computed, sorted', _.orderBy(this.exams, ['date'], ['desc']));
      return _.orderBy(this.exams, ['date'], ['desc'])
    }
  }
  // methods: {
  //   sorted() {

  //   }
  // }
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
