<template>
  <nuxt-link :to="'/' + selected.access" class="clickable">
    <div v-if="selected == null">
      ERROR
    </div>
    <div v-else-if="~students.findIndex(x => x.email.toLowerCase() === selected.email.toLowerCase())" class="select-wrap">
      <i class="bx bxs-user" />
      <i class="bx bxs-circle" :style="{color: isOnline ? 'green' : 'red'}" />
      <i v-if="(score || {}).isChanged" class="bx bxs-pencil" />
      <i v-if="(score || {}).isEmailOpened != null" class="bx" :class="[(score || {}).isEmailOpened ? 'bx-show' : 'bxs-hide']" />
      {{selected.name}} ({{selected.email}})
    </div>
    <span v-else>
      {{selected.name}} ({{selected.email}})
    </span>
  </nuxt-link>
</template>

<script>
import { isWithinInterval, sub } from 'date-fns';
export default {
  props: {
    selected: Object,
    students: Array,
    score: Object
  },
  computed: {
    isOnline() {
      if (!this.selected.onlineAt) return false;
      const now = new Date();
      return isWithinInterval(new Date(this.selected.onlineAt), {start: sub(now, {minutes: 5}), end: now});
    }
  }
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
.clickable {
  cursor: pointer;
}
</style>
