<template>
  <div class="page padded-container">
    <Logo />
    <div v-if="!isSubmit">
      <h1>FEEDBACK SESSION</h1>
      <input v-model="form.email" placeholder="Email">
      <button @click="submit">
        Submit <i class="bx bx-right-arrow-alt" />
      </button>
    </div>
    <div v-else>
      <h2>Check your inbox for your personal link!</h2>
      <h4>Need help? Reach out to us at studywithmillie@milliegroup.com</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    if (!this.$route.query.exam) throw new Error('Bad Request');
    return {
      form: {
        email: ''
      },
      isSubmit: false,
      schools: [],
      exam: this.$route.query.exam
    }
  },
  async fetch() {
    this.schools = await this.$axios.$get('signup-schools');
  },
  methods: {
    async submit() {
      await this.$axios.$post('send-scores-after-feedback-session', {
        exam: this.exam,
        email: this.form.email
      });
      this.isSubmit = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 500px;
}
h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
}
h2 {
  font-size: 1.5rem;
  text-align: center;
}
h4 {
  font-size: .9rem;
  text-align: center;
  margin-top: 15px;
}
input {
  width: 100%;
  padding: .4em .9em;
  font-size: 1.3rem;
  border: 2px solid $primary;
  border-radius: 3px;
  box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  margin-bottom: 25px;
}
button {
  @include flex-center(v);
  display: inline-flex;
  float: right;
  border-radius: 3px;
  font-weight: 500;
  font-size: 1.3rem;
  // background: transparentize($color: #061a33, $amount: .94);
  background: $primary;
  color: white;
  padding: .3em .6em;
}
::v-deep select {
  margin-bottom: 25px;
}
</style>
