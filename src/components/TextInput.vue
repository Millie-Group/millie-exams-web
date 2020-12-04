<template>
  <input v-model="val_" v-bind="$attrs">
</template>

<script>
export default {
  props: {
    val: null
  },
  data() {
    return {
      val_: this.val ?? ''
    }
  },
  watch: {
    val_: {
      immediate: true,
      handler(n) {
        this.$emit('update:val', n);
      }
    },
    val: {
      immediate: true,
      handler(n) {
        this.val_ = n;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  border: 2px solid #fb6c30;
  border-radius: 3px;
}
</style>
