<template>
  <div>
    <h1 v-if="label">
      {{label}}
    </h1>
    <select :value="val" @change="$emit('update:val', $event.target.value)">
      <option v-for="([v, text], idx) in opts" :key="idx" :value="v">
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
  padding: .4em .9em;
  font-size: 1.3em;
  border: 2px solid $primary;
  border-radius: 3px;
  box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  // margin-bottom: 25px;
}
h1 {
  margin-left: 20px;
  font-weight: 500;
  font-size: .9;
  margin-bottom: 6px;
}
</style>
