<template>
  <div>
    <input v-model="name">
    <client-only>
      <table>
        <tr>
          <th>Student</th>
          <th>Section 1</th>
          <th>Section 2</th>
          <th>Section 3</th>
          <th>Section 4</th>
        </tr>
        <tr v-for="idx in studentsLength" :key="idx">
          <td>
            <ExamStudentSelect
              :students="students"
              :selected.sync="selectedStudents[idx-1]"
            />
          </td>
          <td>
            <TextInput :val.sync="scores[idx-1].section1" />
          </td>
          <td>
            <TextInput :val.sync="scores[idx-1].section2" />
          </td>
          <td>
            <TextInput :val.sync="scores[idx-1].section3" />
          </td>
          <td>
            <TextInput :val.sync="scores[idx-1].section4" />
          </td>
        </tr>
      </table>
    </client-only>
    <!-- <ExamStudentSelect
      v-for="idx in studentsLength"
      :key="idx"
      :students="students"
      :selected.sync="selectedStudents[idx-1]"
    /> -->
    <button @click="studentsLength++">
      Add
    </button>

    <button @click="submit">
      Create
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      students: [],
      selectedStudents: [],
      studentsLength: 1,
      scores: []
    }
  },
  async fetch() {
    this.students = await this.$axios.$get('students');
  },
  methods: {
    async submit() {
      const {id} = await this.$axios.$post('exams', {
        name: this.name
      })

      for (const student of this.selectedStudents.filter(x => x)) {
        await this.$axios.$post(`exams/${id}/students/${student.id}`);
      }
    }
  },
  watch: {
    studentsLength: {
      immediate: true,
      handler(n) {
        for (const i of Array(n).keys())
          this.scores[i] = this.scores[i] || {};
      }
    }
  }
}
</script>

<style>

</style>
