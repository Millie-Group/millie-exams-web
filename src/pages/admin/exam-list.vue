<template>
  <div class="padded-container">
    <Logo />
    <div class="new-btn-wrap">
      <nuxt-link to="/admin/search">
        <i class="bx bx-search" style="font-size: 1.5rem; margin-right: -1.5rem" />
      </nuxt-link>
      <nuxt-link to="/admin/create-exam" class="new-btn">
        Create a new exam
        <i class="bx bx-right-arrow-alt" />
      </nuxt-link>
    </div>

    <nuxt-link v-for="exam in exams" :key="exam.id" :to="'/admin/create-exam?edit=' + exam.id" class="exam-card">
      <h1>{{exam.name}}</h1>
      <h2>{{(exam.rooms).reduce((acc, val) => acc + val.students.length, 0)}} students</h2>
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
  async mounted() {
    const exams = (await this.$axios.$get('exams', {
      headers: {
        Authorization: 'Bearer ' + this.$store.state.auth.pw
      }
    }));
    exams.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    this.exams = exams;
  }
}
</script>

<style lang="scss" scoped>
.exam-card {
  border-radius: 7px;
  color: #061a33;
  background: #eaeff6;
  padding: 1em 1.5em 0.5em;
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
  background: #061a33;
  margin: 0 auto;

  @include flex-center(v);
  i {
    font-size: 1.1em;
    margin-left: 7px;
  }
}

.new-btn-wrap {
  @include flex-center(vh);
  margin-bottom: 30px;
}
</style>
