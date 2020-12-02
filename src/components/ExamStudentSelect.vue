<template>
  <div>
    <select v-model="selected_">
      <option :value="null">
        ---
      </option>
      <option v-for="student in students" :key="student.id" :value="student">
        {{student.name}} ({{student.email}})
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    selected: Object,
    students: Array
  },
  data() {
    return {
      selected_: null
    }
  },
  watch: {
    selected_: {
      immediate: true,
      handler(n) {
        this.$emit('update:selected', n);
      }
    }
  }
}
</script>
