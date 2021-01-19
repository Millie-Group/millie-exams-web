<template>
  <div>
    <h1>Exam Status</h1>
    <div class="opts">
      <div :class="[state === 'about-to-start' && 'active']" @click="change('about-to-start')">
        About To Start
      </div>
      <div :class="[state === 'in-progress' && 'active']" @click="change('in-progress')">
        In Progress
      </div>
      <div :class="[state === 'finished' && 'active']" @click="change('finished')">
        Finished
      </div>
      <div :class="[state === 'scored' && 'active']" @click="change('scored')">
        Scored
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    examId: Number,
    state: String // 'about-to-start', 'in-progress', 'finished', 'scored'
  },
  methods: {
    async change(state) {
      if (state === this.state || !confirm(`This action will change the status of the exam to "${state}"`)) return;
      await this.$axios.$post('modify-exam-status', {
        id: this.examId,
        state
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
</style>
