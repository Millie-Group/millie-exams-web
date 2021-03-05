<template>
  <button
    class="plainbtn"
    v-on="$attrs"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.plainbtn {
  @include flex-center(v);
  border-radius: 5px;
  font-weight: 500;
  font-size: 1.3rem;
  color: #ff4b00;
  background: transparentize($color: #ff4b00, $amount: .94);
  padding: .3em .6em;
}
</style>
