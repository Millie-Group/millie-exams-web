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
  border-radius: 10px;
  font-weight: 500;
  font-size: 1.3rem;
  color: #061a33;
  background: #eaeff6;
  padding: .3em .6em;
}
</style>
