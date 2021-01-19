<template>
  <div class="inputwrap">
    <i class="bx bx-upload" />
    <input
      type="file"
      multiple
      class="input-file"
      @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
    >
  </div>
</template>

<script>
export default {
  props: {
    file: null
  },
  methods: {
    filesChange(fieldName, fileList) {
      this.$emit('update:file', fileList[0]);
    }
  }
}
</script>

<style lang="scss" scoped>
.inputwrap {
  width: 30px;
  height: 30px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  margin-top: 20px;

  @include flex-center(vh);
  // display: inline-flex;

  i {
    font-size: 2rem;
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }
  input {
    position: absolute;
    width: 100%;
    height: 30px;
    opacity: 0;
    font-size: 0;
    cursor: pointer;
  }
}
</style>
