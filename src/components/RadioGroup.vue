<template>
  <div>
    <h1 v-if="label">
      {{label}}
    </h1>
    <h2 v-if="sublabel" style="">
      {{sublabel}}
    </h2>
    <!-- <select :value="opts.findIndex(([v]) => v === val)" @change="$emit('update:val', opts[$event.target.value][0])"> -->
    <label
      v-for="([v, text], idx) in opts"
      :key="idx"
      style="display: flex; margin: 10px -13px; font-size: 0.9rem;"
    >
      <input
        type="radio"
        :value="v"
        :checked="val === v"
        @change="$emit('update:val', v)"
      >
      <span style="margin-left: 20px">
        {{text}}
      </span>
    </label>
    <!-- </select> -->
  </div>
</template>

<script>
export default {
  props: {
    opts: null,
    val: null,
    label: null,
    sublabel: null,
  }
}
</script>

<style>
h1 {
  margin-left: 20px;
  font-weight: 500;
  font-size: .9;
  margin-bottom: 6px;
}
h2 {
  margin-left: 20px;
  font-weight: 400;
  font-size: .9rem;
  margin-bottom: 14px;
}
</style>
