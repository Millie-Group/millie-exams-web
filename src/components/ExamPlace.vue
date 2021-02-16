<template>
  <div v-if="place" class="place">
    <i class="bx bxs-trophy" :style="{color: (['gold', 'silver', '#cd7f32'])[place - 1]}" />
    <h1>
      You were the {{humanPlace}}best performing student!
    </h1>
  </div>
</template>

<script>
export default {
  props: {
    place: Number
  },
  computed: {
    humanPlace() {
      return ({
        1: '',
        2: 'second ',
        3: 'third '
      })[this.place]
    }
  }
}
</script>

<style lang="scss" scoped>
.place {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;

  i {
    font-size: 3rem;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: black;
  }

  h1 {
    font-weight: 500;
    margin-left: 20px;
  }
}
</style>
