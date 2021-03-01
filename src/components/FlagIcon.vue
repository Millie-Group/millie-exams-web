<template>
  <div class="flag">
    <i class="flag-icon" :class="['flag-icon-' + code]" />
  </div>
</template>

<script>
export default {
  props: {
    code: String
  }
}
</script>

<style lang="scss" scoped>
.flag {
  // border: 2px dotted black;
  // padding: 2px;
}
</style>
