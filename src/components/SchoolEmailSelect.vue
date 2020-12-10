<template>
  <div class="select-wrap">
    <select v-model="selected_">
      <option v-for="opt in options" :key="opt.id" :value="opt.id">
        {{opt.name}}
      </option>
    </select>
    <i class="bx bxs-down-arrow" />
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    selected: null
  },
  data() {
    return {
      selected_: null
    }
  },
  watch: {
    selected_: {
      immediate: true,
      handler(n) {
        this.$emit('update:selected', n);
      }
    },
    selected: {
      immediate: true,
      handler(n) {
        this.selected_ = n;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
select {
  border: 2px solid #ddd;
  padding: .2em 1.5em .2em .4em;
  // width: 100%;
  border-radius: 3px;
}
.select-wrap {
  position: relative;
  display: inline-block;
  // width: 100%;
  i {
    position: absolute;
    right: 5px;
    top: 50%;
    font-size: .7em;
    color: #555;
    transform: translateY(-50%);
    pointer-events: none;
  }
}
</style>
