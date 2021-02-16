<template>
  <div v-if="false" class="wrapper">
    <h6>Sign up to an exam</h6>
    <div class="flex">
      <input v-model="id" placeholder="Exam ID">
      <i class="bx bx-send" @click="send" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: ''
    }
  },
  methods: {
    send() {
      if (!this.id) return;
      this.$axios.$post('add-user-to-exam', {
        access: this.$route.params.id,
        exam: this.id
      });
      window.location.reload();
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 100px;
  padding: .3em .7em;
  font-size: 1rem;
  border: 2px solid $primary;
  border-radius: 5px;
  box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  // margin-bottom: 25px;
}
h6 {
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}
div.wrapper {
  margin-top: 10px;
  margin-bottom: -15px;
}
.flex {
  display: flex;
  align-items: center;

  i {
    font-size: 1.5rem;
    margin-left: 7px;
    cursor: pointer;
  }
}
</style>
