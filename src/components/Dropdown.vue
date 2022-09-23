<template>
  <div>
    <h1 v-if="label">
      {{label}}
    </h1>
    <select :value="opts.findIndex(([v]) => v === val)" @change="$emit('update:val', opts[$event.target.value][0])">
      <option v-for="([, text], idx) in opts" :key="idx" :value="idx">
        {{text}}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    opts: null,
    val: null,
    label: null
  }
}
</script>

<style lang="scss" scoped>
select {
  width: 100%;
  padding: 8px 20px;
  font-size: 0.9rem;
  border: 2px solid $primary;
  border-radius: 10px;
  // box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  // margin-bottom: 25px;
}
h1 {
  margin-left: 20px;
  font-weight: 500;
  font-size: .9;
  margin-bottom: 6px;
}
</style>
