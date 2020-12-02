<template>
  <input v-model="val_">
</template>

<script>
export default {
  props: {
    val: String
  },
  data() {
    return {
      val_: ''
    }
  },
  watch: {
    val_: {
      immediate: true,
      handler(n) {
        this.$emit('update:val', n);
      }
    }
  }
}
</script>

<style>

</style>
