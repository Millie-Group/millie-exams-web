<template>
  <div class="thin-padded-container">
    <Logo />

    <div class="flex-wrap">
      <input v-model="pw" placeholder="Password" type="password">
      <button @click="login()">
        Continue <i class="bx bx-right-arrow-alt" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pw: '',
      correct: true,
      promise: null
    }
  },
  methods: {
    login() {
      this.promise = this.$axios.$post('/login', {pw: this.pw}, {progress: false});
      this.promise.then((x) => {
        if (x)
          this.$router.push({path: '/admin/exam-list'})
      });
    }
  },
  watch: {
    pw: {
      handler(n) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.thin-padded-container {
  width: 400px;
  margin: 0 auto;
}
.flex-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  input {
    width: 100%;
    padding: .4em .9em;
    font-size: 1.3rem;
    border: 2px solid $primary;
    border-radius: 100px;
    box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
    margin-bottom: 20px;
  }
  button {
    @include flex-center(v);
    border-radius: 100px;
    font-weight: 500;
    font-size: 1.3rem;
    color: #ff4b00;
    background: transparentize($color: #ff4b00, $amount: .94);
    padding: .3em .6em;
  }
}
</style>
