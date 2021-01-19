<template>
  <div class="page padded-container">
    <Logo />
    <div v-if="!isSubmit">
      <h1>SIGN UP</h1>
      <input v-model="form.name1" placeholder="First Name">
      <input v-model="form.name2" placeholder="Last Name">
      <input v-model="form.email" placeholder="Email">
      <button @click="submit">
        Submit <i class="bx bx-right-arrow-alt" />
      </button>
    </div>
    <div v-else>
      <h2>Please check your inbox for your personal link!</h2>
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
        email: '',
        name1: '',
        name2: ''
      },
      isSubmit: false
    }
  },
  methods: {
    async submit() {
      await this.$axios.$post(`exams/${this.$route.query.exam}/signup`, {
        email: this.form.email,
        name: this.name1 + ' ' + this.name2
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
  border-radius: 100px;
  box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  margin-bottom: 25px;
}
button {
  @include flex-center(v);
  display: inline-flex;
  float: right;
  border-radius: 100px;
  font-weight: 500;
  font-size: 1.3rem;
  color: #ff4b00;
  background: transparentize($color: #ff4b00, $amount: .94);
  padding: .3em .6em;
}
</style>
