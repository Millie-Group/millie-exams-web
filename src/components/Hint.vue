<template>
  <aside class="hint">
    <i class="bx bxs-help-circle" /><slot />
  </aside>
</template>

<script>
export default {

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
