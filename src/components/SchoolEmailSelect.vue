<template>
  <div class="select-wrap">
    <select v-model="selected_">
      <option value="all">
        ALL
      </option>
      <option value="selection">
        SELECTION
      </option>
      <option v-for="opt in sorted" :key="opt.id" :value="opt.id">
        {{opt.name}}
      </option>
    </select>
    <i class="bx bxs-down-arrow" />
  </div>
</template>

<script>
import { sortBy } from 'lodash';
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
  computed: {
    sorted() {
      return sortBy([...this.options], 'name');
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
  width: 100%;
  padding: .4em .9em;
  font-size: 1.3em;
  border: 2px solid #061a33;
  border-radius: 3px;
  box-shadow: 0 6px 6px #eaeff6;
  // margin-bottom: 25px;
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
