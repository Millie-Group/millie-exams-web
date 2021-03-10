<template>
  <div class="wrap">
    <slot><i class="bx bx-upload" /></slot>
    <input ref="fileinput" type="file" accept=".csv" @change="load">
  </div>
</template>

<script>
export default {
  methods: {
    load(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.$emit('load', e.target.result);
        this.$refs.fileinput.value = null;
      }
      reader.readAsText(file);
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  // width: 30px;
  // height: 30px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  @include flex-center(vh);
  display: inline-flex;

  i {
    font-size: 2rem;
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }
  input {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    font-size: 0;
    cursor: pointer;
  }
}
</style>
