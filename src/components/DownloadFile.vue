<template>
  <div v-if="url" style="display: none">
    <iframe :src="`${url}?name=${name}`" />
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    name: String
  },
  watch: {
    url(n) {
      if (n) setTimeout(() => { this.$emit('update:url', null) }, 20);
    }
  }
}
</script>

<style>

</style>
