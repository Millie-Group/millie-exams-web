<template>
  <div class="thin-padded-container">
    <Logo />

    <div class="flex-wrap">
      <input v-model="pw" placeholder="Password" type="password">
      <nuxt-link v-if="correct" to="/admin/exam-list">
        Continue <i class="bx bx-right-arrow-alt" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import {cancelable} from 'cancelable-promise';
export default {
  data() {
    return {
      pw: '',
      correct: false,
      promise: null
    }
  },
  watch: {
    pw: {
      handler(n) {
        if (this.promise) this.promise.cancel();
        this.promise = cancelable(this.$axios.$post('/login', {pw: n}, {progress: false}));
        this.promise.then((x) => {
          this.correct = x
        });
        this.$store.commit('auth/set', n)
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
  a {
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
