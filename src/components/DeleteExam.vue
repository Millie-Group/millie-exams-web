<template>
  <div v-if="examId">
    <i class="bx bx-trash" @click="rem" />
  </div>
</template>

<script>
export default {
  props: {
    examId: null
  },
  methods: {
    async rem() {
      if (!confirm('THIS ACTION WILL DELETE THE EXAM! (this action is reversible)')) return;
      await this.$axios.$post('delete-exam', {
        exam: this.examId
      }, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
i {
  font-size: 1.3rem;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>
