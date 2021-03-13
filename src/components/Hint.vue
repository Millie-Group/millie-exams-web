<template>
  <aside class="hint">
    <i class="bx" :class="[icon]" /><slot />
  </aside>
</template>

<script>
export default {
  props: {
    icon: {
      default: 'bxs-help-circle',
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.hint {
  font-size: .9rem;
  display: flex;
  align-items: center;
  font-weight: 500;
  i {
    margin-right: 7px;
    font-size: 1.2em;
  }
}
</style>
