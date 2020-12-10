<template>
  <button @click="$router.push('/admin/exam-list')">
    <i class="bx bxs-chevron-left" />
    Go Back
  </button>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
button {
  @include flex-center(v);
  border-radius: 5px;
  font-weight: 500;
  font-size: 1.3rem;
  color: #ff4b00;
  background: transparentize($color: #ff4b00, $amount: .94);
  padding: .3em .6em;
  margin-top: -40px;
  transform: translateY(-100%);
}
</style>
