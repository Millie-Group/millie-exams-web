<template>
  <div>
    <div v-if="selected == null">
      ERROR
    </div>
    <div v-else-if="~students.findIndex(x => x.email === selected.email)" class="select-wrap">
      <i class="bx bxs-user" />
      <i v-if="(score || {}).isChanged" class="bx bxs-pencil" />
      {{selected.name}} ({{selected.email}})
    </div>
    <span v-else>
      {{selected.name}} ({{selected.email}})
    </span>
  </div>
</template>

<script>
export default {
  props: {
    selected: Object,
    students: Array,
    score: Object
  },
}
</script>

<style lang="scss" scoped>
select {
  border: 2px solid #ddd;
  padding: .2em .4em;
  width: 100%;
  border-radius: 3px;
}
.select-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  i {
    // position: absolute;
    // right: 5px;
    // top: 50%;
    font-size: .8em;
    color: #555;
    // transform: translateY(-50%);
  }
}
</style>
