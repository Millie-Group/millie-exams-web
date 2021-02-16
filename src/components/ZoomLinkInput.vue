<template>
  <div style="margin-bottom: 10px">
    <TextInput :val="zoom" placeholder="Zoom Link" @update:val="x => $emit('update:zoom', x)" />
    <button @click="submit">
      Submit
    </button>
  </div>
</template>

<script>
export default {
  props: {
    examId: null,
    zoom: null
  },
  methods: {
    async submit() {
      await this.$axios.$put('/exams/' + this.examId, {
        meta: {zoom: this.zoom}
      }, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });
      window.location.reload();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
