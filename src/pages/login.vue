<template>
  <div class="page padded-container">
    <Logo />
    <div v-if="!isSubmit">
      <h1>LOG IN</h1>
      <nuxt-link :to="'/signup?exam=' + $route.query.exam" style="margin-bottom: 30px">
        <button style="margin-bottom: 1px; background: none; color: black; font-size: 1em; text-decoration: underline;">
          Sign up instead
        </button>
      </nuxt-link>
      <TextInput :val.sync="form.email" placeholder="Your email" label="Email" />
      <button right @click="submit">
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
      await this.$axios.$post(`exams/${this.$route.query.exam}/signup`, {
        email: this.form.email,
        isLogin: true
      });
      this.isSubmit = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 500px;
  font-family: Poppins;
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
  font-size: 0.9rem;
  border: 2px solid $primary;
  border-radius: 10px;
  // box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  margin-bottom: 25px;
}
button {
  @include flex-center(v);
  display: inline-flex;
  border-radius: 10px;
  font-weight: 500;
  font-size: 1.2rem;
  // background: transparentize($color: #061a33, $amount: .94);
  background: $primary;
  color: white;
  padding: .5em 1.1em;
  &[disabled] {
    opacity: .3;
  }
  &[right] {
    float: right;
  }
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
::v-deep select {
  margin-bottom: 25px;
}
</style>
