<template>
  <div class="validation-hint">
    <IconLabel :icon="correct ? 'bx-check' : 'bx-x'" :class="[hide && 'hide']">
      <slot />
    </IconLabel>
  </div>
</template>

<script>
export default {
  props: {
    correct: {
      type: Boolean
    },
    hide: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.validation-hint {
  font-size: .9rem;
  font-weight: 500;
  margin-bottom: 3px;
  color: #555;
}
.hide {
  opacity: 0;
}
</style>
