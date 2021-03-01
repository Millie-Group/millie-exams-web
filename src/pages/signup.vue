<template>
  <div class="bg">
    <div class="page padded-container">
      <Logo />
      <div v-if="!isSubmit">
        <h1>Sign up to Millie SAT Diagnostic Test</h1>
        <h3>{{examDate}}</h3>
        <!-- <div>{{exam}} {{examDate}}</div> -->
        <!-- {{errors}} {{country}}
        {{ form }} -->
        <nuxt-link :to="'/login?exam=' + $route.query.exam">
          <button>
            I already have an account <i class="bx bx-right-arrow-alt" />
          </button>
        </nuxt-link>
        <form @submit.prevent>
          <TextInput
            :val.sync="form.name1"
            label="First Name*"
            placeholder="e.g. Milile"
            :validators="[
              [null, x => x.length > 0]
            ]"
            @validated="name1 => setError({name1})"
          />
          <TextInput
            :val.sync="form.name2"
            label="Last Name*"
            placeholder="e.g. Billie"
            :validators="[
              [null, x => x.length > 0]
            ]"
            @validated="name2 => setError({name2})"
          />
          <TextInput
            :val.sync="form.email"
            label="Email*"
            placeholder="e.g. john.smith@gmail.com"
            :validators="[
              [form.email.length && 'The email should be valid', x => /^.+@.+\.[a-zA-Z]{2,}$/.test(x)]
            ]"
            @validated="email => setError({email})"
          />
          <TextInput
            :val.sync="form.emailRepeat"
            label="Repeat email*"
            placeholder="Repeat your email"
            :validatordeps="[
              form.emailRepeat
            ]"
            :validators="[
              [form.emailRepeat.length && 'Emails should match', x => (x === form.email)]
            ]"
            @validated="emailRepeat => setError({emailRepeat})"
          />
          <CountryDropDown :val.sync="country" />
          <PhoneNoInput
            v-if="Object.keys(country).length > 0"
            :country="country"
            :val.sync="form.info.whatsapp"
            @validated="whatsapp => setError({whatsapp})"
          >
            Phone Number*
          </PhoneNoInput>
          <Dropdown
            :opts="[
              ['2021', '2021'],
              ['2022', '2022'],
              ['2023', '2023'],
              ['2024', '2024']
            ]"
            :val.sync="form.info.gradYear"
            label="High school graduation year*"
            style="margin-bottom: 0"
          />
          <Dropdown
            :opts="[[null, 'OTHER (I can\'t find my school in the list)'], ...schools.map(x => [x.id, x.name])]"
            :val.sync="form.schoolRel"
            label="School*"
            style="margin-bottom: 0"
          />
          <TextInput
            v-show="!form.schoolRel"
            :val.sync="form.info.schoolName"
            label="Your school's name*"
            placeholder="e.g. American Academy School"
            :validators="[
              [null, x => form.schoolRel || x.length > 0]
            ]"
            :validatordeps="[
              form.schoolRel
            ]"
            @validated="school => setError({school})"
          />
          <Dropdown
            :opts="[
              [true, 'Yes'],
              [false, 'No'],
            ]"
            :val.sync="form.info.satBefore"
            label="Have you taken the SAT before?*"
            style="margin-bottom: 0"
          />
          <Dropdown
            :opts="[
              [true, 'Yes'],
              [false, 'No'],
            ]"
            :val.sync="form.info.knowMillie"
            label="Do you know Millie?*"
            style="margin-bottom: 0"
          />
          <label style="display: flex">
            <input v-model="accepttos" type="checkbox" style="margin-right: 20px;">
            <div>
              <span style="display: block; font-weight: 500;">I agree to Millie Privacy Policy*</span>
              By filling out this form, you also sign up to Millie distribution list for full access to our weekly webinars and panels. You will be able to unsubscribe at any time by clicking the link in the footer of our emails. For information about our privacy practices, please visit our website.
            </div>
          </label>
          <div
            class="flex-right"
            style="margin-bottom: 80px"
          >
            <button
              right
              :disabled="Object.values(errors).filter(x => !x).length > 0 || !Object.keys(country).length || !accepttos"
              @click="submit"
            >
              Submit <i class="bx bx-right-arrow-alt" />
            </button>
          </div>
        </form>
        <!-- {{schools}} -->
      </div>
      <div v-else>
        <h2>Please check your inbox for your personal link!</h2>
        <h4>Need help? Reach out to us at studywithmillie@milliegroup.com</h4>
      </div>
    </div>
  </div>
</template>

<script>
import {format} from 'date-fns';
export default {
  data() {
    if (!this.$route.query.exam) throw new Error('Bad Request');
    return {
      form: {
        email: '',
        emailRepeat: '',
        name1: '',
        name2: '',
        schoolRel: null,
        info: {
          gradYear: '2021',
          satBefore: true,
          knowMillie: true,
          whatsapp: '',
          schoolName: ''
        }
      },
      country: {},
      isSubmit: false,
      schools: [],
      errors: {},
      exam: null,
      accepttos: false
    }
  },
  async fetch() {
    this.exam = await this.$axios.$get('/examsinfo/' + this.$route.query.exam)
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
          schoolName: this.form.schoolRel ? null : this.form.info.schoolName,
          country: this.country.name,
          name1: this.form.name1,
          name2: this.form.name2
        }
      });
      this.isSubmit = true;
    },
    setError(x) {
      for (const [k, v] of Object.entries(x))
        this.$set(this.errors, k, v)
    }
  },
  computed: {
    examDate() {
      if (!this.exam) return ''
      return format(new Date(this.exam.date), 'EEEE, d MMMM h:mm a O')
    },
    test() {
      return {
        ...this.form.info,
        schoolName: this.form.schoolRel ? null : this.form.info.schoolName,
        country: this.country.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 700px;
  padding: 0 20px;
  background: white;
  margin-top: 30px;
  padding-top: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 17px -5px rgba(0, 0, 0, .5);
  padding-bottom: 1px;
  // padding-bottom: 1px;
  @include tablet-up {
    padding-left: 80px;
    padding-right: 80px;
  }
}
.bg {
  background: rgb(251, 108, 48);
  padding-top: 1px;
  padding-bottom: 1px;
  min-height: 100vh;
}
h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 5px;
  text-align: center;
}
h3 {
  font-size: 1.1rem;
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
  margin-bottom: 30px;
}
// input {
//   width: 100%;
//   padding: .4em .9em;
//   font-size: 1.3rem;
//   border: 2px solid $primary;
//   border-radius: 3px;
//   box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
//   margin-bottom: 25px;
// }
form > * {
  margin-bottom: 25px;
}
button {
  @include flex-center(v);
  display: inline-flex;
  border-radius: 3px;
  font-weight: 500;
  font-size: 1.3rem;
  // background: transparentize($color: #ff4b00, $amount: .94);
  background: $primary;
  color: white;
  padding: .3em .6em;
  &[disabled] {
    opacity: .3;
  }
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
}
::v-deep select {
  margin-bottom: 25px;
}
.flex-right {
  display: flex;
  justify-content: flex-end;
}
</style>
