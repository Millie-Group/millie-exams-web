<template>
  <div class="page padded-container">
    <Logo />
    <div v-if="!isSubmit">
      <h1>SIGN UP</h1>
      <input v-model="form.name1" placeholder="First Name">
      <input v-model="form.name2" placeholder="Last Name">
      <input v-model="form.email" placeholder="Email">
      <input v-model="form.info.whatsapp" placeholder="WhatsApp Number">
      <input v-model="form.info.gradYear" placeholder="High school graduation year">
      <Dropdown
        :opts="[[null, 'OTHER (I can\'t find my school in the list)'], ...schools.map(x => [x.id, x.name])]"
        :val.sync="form.schoolRel"
        label="School"
      />
      <input v-if="!form.schoolRel" v-model="form.info.schoolName" placeholder="Your school's name">
      <Dropdown
        :opts="[
          [null, '—'],
          [true, 'Yes'],
          [false, 'No'],
        ]"
        :val.sync="form.info.satBefore"
        label="Have you taken the SAT before?"
      />
      <Dropdown
        :opts="[
          [null, '—'],
          [true, 'Yes'],
          [false, 'No'],
        ]"
        :val.sync="form.info.knowMillie"
        label="Do you know Millie?"
      />
      <button @click="submit">
        Submit <i class="bx bx-right-arrow-alt" />
      </button>
      <!-- {{schools}} -->
    </div>
    <div v-else>
      <h2>Please check your inbox for your personal link!</h2>
      <h4>Need help? Reach out to us at studywithmillie@milliegroup.com</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    if (!this.$route.query.exam) throw new Error('Bad Request');
    return {
      form: {
        email: '',
        name1: '',
        name2: '',
        schoolRel: null,
        info: {
          gradYear: '',
          satBefore: null,
          knowMillie: null,
          whatsapp: '',
          schoolName: ''
        }
      },
      isSubmit: false,
      schools: []
    }
  },
  async fetch() {
    this.schools = await this.$axios.$get('signup-schools');
  },
  methods: {
    async submit() {
      await this.$axios.$post(`exams/${this.$route.query.exam}/signup`, {
        email: this.form.email,
        name: this.form.name1 + ' ' + this.form.name2,
        schoolRel: this.form.schoolRel,
        info: {
          ...this.form.info,
          schoolName: this.form.schoolRel ? null : this.form.info.schoolName
        }
      });
      this.isSubmit = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 500px;
}
h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
}
h2 {
  font-size: 1.5rem;
  text-align: center;
}
h4 {
  font-size: .9rem;
  text-align: center;
  margin-top: 15px;
}
input {
  width: 100%;
  padding: .4em .9em;
  font-size: 1.3rem;
  border: 2px solid $primary;
  border-radius: 3px;
  box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  margin-bottom: 25px;
}
button {
  @include flex-center(v);
  display: inline-flex;
  float: right;
  border-radius: 3px;
  font-weight: 500;
  font-size: 1.3rem;
  // background: transparentize($color: #ff4b00, $amount: .94);
  background: $primary;
  color: white;
  padding: .3em .6em;
}
::v-deep select {
  margin-bottom: 25px;
}
</style>
