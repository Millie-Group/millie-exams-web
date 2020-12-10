<template>
  <div>
    <div v-if="selected == null || ~students.findIndex(x => x.email === selected.email)" class="select-wrap">
      <select v-model="selected_">
        <option :value="null">
          ---
        </option>
        <option v-for="student in students" :key="student.id" :value="student">
          {{student.name}} ({{student.email}})
        </option>
      </select>
      <i class="bx bxs-down-arrow" />
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
    students: Array
  },
  data() {
    return {
      selected_: this.selected ? this.students.find(x => x.email === this.selected.email) : null
    }
  },
  watch: {
    selected_: {
      handler(n) {
        this.$emit('update:selected', n);
      }
    },
    selected: {
      handler(n) {
        this.selected_ = this.students.find(x => x.email === this.selected.email);
      }
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
    position: absolute;
    right: 5px;
    top: 50%;
    font-size: .7em;
    color: #555;
    transform: translateY(-50%);
  }
}
</style>
