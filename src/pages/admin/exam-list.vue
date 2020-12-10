<template>
  <div class="padded-container">
    <Logo />
    <div class="new-btn-wrap">
      <nuxt-link to="/admin/create-exam" class="new-btn">
        Create a new exam
        <i class="bx bx-right-arrow-alt" />
      </nuxt-link>
    </div>

    <nuxt-link v-for="exam in exams" :key="exam.id" :to="'/admin/create-exam?edit=' + exam.id" class="exam-card">
      <h1>{{exam.name}}</h1>
      <h2>{{exam.students.length}} students</h2>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exams: []
    }
  },
  async fetch() {
    this.exams = await this.$axios.$get('exams');
  }
}
</script>

<style lang="scss" scoped>
.exam-card {
  border-radius: 7px;
  color: #ff4b00;
  background: #fff4f0;
  padding: 1em 1.5em;
  cursor: pointer;
  transition: transform .2s ease;
  display: block;
  display: flex;
  align-items: baseline;

  &:hover {
    transform: scale(1.05);
    transition: transform .3s ease;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  & + & {
    margin-top: 30px;
  }

  & > * + * {
    margin-left: 10px;
  }
}

.new-btn {
  font-weight: 500;
  padding: .4em .8em;
  border-radius: 5px;
  color: white;
  background: #ff4b00;
  margin: 0 auto 30px;

  @include flex-center(v);
  i {
    font-size: 1.1em;
    margin-left: 7px;
  }
}

.new-btn-wrap {
  @include flex-center(h);
}
</style>
