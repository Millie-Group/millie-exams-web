<template>
  <div class="page padded-container">
    <input v-model="q">
    <ul>
      <li v-for="student in results.slice(0, 30)" :key="student.id">
        <nuxt-link :to="'/' + student.access">
          {{student.name}} ({{student.email}})
        </nuxt-link>
      </li>
    </ul>
    <i v-if="results.length > 30" style="margin-top: 20px; display: block">
      ...and {{results.length - 30}} more results
    </i>
  </div>
</template>

<script>
import { debounce } from 'lodash';
export default {
  data() {
    return {
      q: '',
      results: [],
      deb: debounce(async () => {
        this.results = await this.$axios.$get('search-students?q=' + this.q, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.pw
          }
        });
      }, 750)
    }
  },
  watch: {
    q: {
      immediate: true,
      handler(n) {
        this.deb();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 600px;
}
input {
  width: 100%;
  padding: .4em .9em;
  font-size: 1.3rem;
  border: 2px solid $primary;
  border-radius: 100px;
  box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  margin-bottom: 20px;
  margin-top: 30px;
}
li {
  border-radius: 7px;
  color: #061a33;
  background: #eaeff6;
  padding: 1em 1.5em;
  & + & {
    margin-top: 10px;
  }
}
</style>
