<template>
  <div>
    <input v-model="name">
    <input v-model="email">
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
      email: ''
    }
  },
  methods: {
    async submit() {
      await this.$axios.$post('students', {
        name: this.name, email: this.email
      })
    }
  }
}
</script>

<style>

</style>
