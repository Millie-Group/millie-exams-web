<template>
  <div class="exam-type">
    <h1>Exam Type</h1>
    <div class="opts">
      <div :class="[type === 'public' && 'active']" @click="change('public')">
        Public
      </div>
      <div :class="[type === 'private' && 'active']" @click="change('private')">
        Private
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    examId: Number,
    type: String
  },
  methods: {
    async change(type) {
      if (type === this.type || !confirm(`This action will change the type of the exam to "${type}"`)) return;
      await this.$axios.$post('modify-exam-meta', {
        id: this.examId,
        meta: {
          type
        }
      }, {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.auth.pw
        }
      });
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 3px;
}
.active {
  font-weight: 500;
}
.opts {
  margin-top: 7px;
  & > * {
    margin-top: 2px;
    cursor: pointer;
  }
}
.exam-type {
  margin-bottom: 16px;
}
</style>
