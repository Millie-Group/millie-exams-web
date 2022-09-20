<template>
  <div class="bg">
    <div class="page padded-container poppins">
      <Logo />
      <div v-if="!isSubmit">
        <h1>Sign up to Millie SAT Diagnostic Test</h1>
        <h3 style="font-size: 0.9rem; margin-top: 10px; opacity: 0.75">
          {{examDate}}</h3>

        <div v-if="page === 1">
          <div style="margin-bottom: 30px;">
            <div style="padding: 0 20px 0 53px; text-align: left">
              This <b>free</b> practice exam includes:</div>
            <div style="padding: 0 20px 0 53px;margin-top: 10px">
              🖊️ A <b>full-length</b> exam simulating the actual SAT test</div>
            <div style="padding: 0 20px 0 53px;margin-top: 10px">
              👩‍🏫 Live <b>proctoring</b> for the entire duration of the test</div>
            <div style="padding: 0 20px 0 53px;margin-top: 10px">
              💯 <b>Results</b>, incl. total score and scores for each section</div>
            <div style="padding: 0 20px 0 53px;margin-top: 10px; margin-bottom: 30px;">
              💻 A free, interactive <b>feedback</b> session after the test</div>

            <div style="padding: 0 20px 0 53px;margin-top: 30px;">
              Before we can get you set up, take 10 minutes to answer a few questions about yourself, your academic interests, and university goals.  Thank you for your interest in signing up for Millie’s SAT Diagnostic Test!
            </div>
          </div>
          <!-- <div>{{exam}} {{examDate}}</div> -->
          <!-- {{errors}} {{country}}
          {{ form }} -->

          <div style="text-align: center; margin-bottom: 20px;">
            <button
              style=""
              @click="switchPage(2)"
            >
              Take me there <i class="bx bx-right-arrow-alt" />
            </button>
          </div>
          <nuxt-link :to="'/login?exam=' + $route.query.exam" style="margin-bottom: 30px">
            <button style="margin-bottom: 1px; background: none; color: black; font-size: 1em; text-decoration: underline;">
              I already have an account
            </button>
          </nuxt-link>
        </div>
        <form
          style="margin-top: 40px"
          @submit.prevent
        >
          <div v-if="page === 2">
            <TextInput
              :val.sync="form.name1"
              label="First Name*"
              placeholder="e.g. Millie"
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
              placeholder="e.g. millie.billie@gmail.com"
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
            <TextInput
              :val.sync="form.info.igHandle"
              label="IG Handle"
              placeholder="Your Instagram handle"
              :validators="[]"
              @validated="igHandle => setError({igHandle})"
            />
            <CountryDropDown :val.sync="country" label="Type the country of your WhatsApp no.*" />
            <PhoneNoInput
              v-if="Object.keys(country).length > 0"
              label="Your WhatsApp no.*"
              :country="country"
              :val.sync="form.info.whatsapp"
              @validated="whatsapp => setError({whatsapp})"
            />
            <Dropdown
              :opts="[
                ['2022', '2022'],
                ['2023', '2023'],
                ['2024', '2024'],
                ['2025', '2025'],
                ['2026', '2026']
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
                ['School', 'School'],
                ['Social Media', 'Social Media'],
                ['Friends & Family', 'Friends & Family'],
                ['Other', 'Other']
              ]"
              :val.sync="form.info.knowMillieFrom"
              label="How do you know Millie?*"
              style="margin-bottom: 0"
            />
            <TextInput
              :val.sync="form.info.parent.name1"
              label="Parent's First Name*"
              placeholder="e.g. Lillie"
              :validators="[
                [null, x => x.length > 0]
              ]"
              @validated="parent_name1 => setError({parent_name1})"
            />
            <TextInput
              :val.sync="form.info.parent.name2"
              label="Parent's Last Name*"
              placeholder="e.g. Billie"
              :validators="[
                [null, x => x.length > 0]
              ]"
              @validated="parent_name2 => setError({parent_name2})"
            />
            <TextInput
              :val.sync="form.info.parent.email"
              label="Parent's Email*"
              placeholder="e.g. lillie.billie@gmail.com"
              :validators="[
                [form.email.length && 'The email should be valid', x => /^.+@.+\.[a-zA-Z]{2,}$/.test(x)]
              ]"
              @validated="parent_email => setError({parent_email})"
            />
            <CountryDropDown :val.sync="parentCountry" label="Type the country of your parent’s WhatsApp no." />
            <PhoneNoInput
              v-if="Object.keys(parentCountry).length > 0"
              label="Your parent’s WhatsApp no.*"
              :country="parentCountry"
              :val.sync="form.info.parent.whatsapp"
              @validated="parent_whatsapp => setError({parent_whatsapp})"
            />
            <div style="text-align: center; margin-bottom: 30px;">
              <button
                style=""
                :disabled="(Object.values(errors).filter(x => !x).length > 0 || !Object.keys(country).length || !Object.keys(parentCountry).length)"
                @click="switchPage(3)"
              >
                Next step <i class="bx bx-right-arrow-alt" />
              </button>
            </div>
          </div>
          <div v-if="page === 3">
            <RadioGroup
              :opts="[
                ['tutoring', 'Yes, tutoring'],
                ['college-counseling', 'Yes, college counseling'],
                ['tutoring-and-college-counseling', 'Yes, tutoring and college counseling'],
                ['other', 'Yes, in other areas'],
                ['no', 'No']
              ]"
              :val.sync="form.info.extraAcademicSupport"
              label="Do you get extra academic support outside of school?*"
            />
            <RadioGroup
              :opts="[
                ['1-1', '1-1 tutoring'],
                ['group', 'Group tutoring'],
                ['both', 'I find both helpful'],
                ['none', 'I don\'t find tutoring helpful'],
              ]"
              :val.sync="form.info.tutoringPreference"
              label="Do you prefer*"
            />
            <RadioGroup
              :opts="[
                ['terrible', 'Terrible'],
                ['so-so', 'So so'],
                ['need-guidance', 'I\'m creative, but need some guidance'],
                ['pro', 'I\'m a pro!'],
                ['unsure', 'I am not sure']
              ].reverse()"
              :val.sync="form.info.essayWritingAbility"
              label="How would you describe your essay writing ability?*"
            />
            <RadioGroup
              :opts="[
                ['high', 'I am very actively involved (5+ activities)'],
                ['medium', 'I do a couple things I like (2-4 activities)'],
                ['low', 'I don’t really do much outside of class (0-1 activities)'],
              ]"
              :val.sync="form.info.extracurricularInvolvement"
              label="How would you describe your extracurricular involvement?*"
              sublabel="Extracurricular activities include: club, sports & music, as well as other  personal activities. e.g. summer school, internship, academic research, volunteer work, etc."
            />

            <div style="text-align: center; margin-bottom: 30px;">
              <button
                style=""
                :disabled="Object.values(errors).filter(x => !x).length > 0"
                @click="switchPage(4)"
              >
                Next step <i class="bx bx-right-arrow-alt" />
              </button>
            </div>
          </div>
          <div v-if="page === 4">
            <CheckboxGroup
              :opts="[
                ['stem', 'STEM (engineering, Math, Science)'],
                ['humanities', 'Humanities (Pre-law, History, languages)'],
                ['social-sciences', 'Social Sciences (Economics, political science)'],
                ['arts', 'Arts (design, architecture)'],
                ['business', 'Business'],
                ['unsure', 'I have no idea'],
                ['other', 'Other'],
              ]"
              :vals.sync="form.info.interestedInMajors"
              label="What major (in general) are you interested in studying at university?*"
              sublabel="Select all that apply"
            />
            <CheckboxGroup
              :opts="[
                ['us', 'US'],
                ['uk', 'UK'],
                ['ca', 'Canada'],
                ['eu', 'EU'],
                ['hk', 'Hong Kong'],
                ['local', 'Local (my home country)'],
                ['other', 'Other'],
              ]"
              :vals.sync="form.info.studyDestinations"
              label="Where would you like to study for university?*"
              sublabel="Select all that apply"
            />
            <RadioGroup
              :opts="[
                ['yes', 'Yes'],
                ['no', 'No'],
                ['unsure', 'Not sure'],
              ]"
              :val.sync="form.info.interestedInOxbridge"
              label="Are you interested in applying to Oxbridge?"
            />
            <RadioGroup
              :opts="[
                ['yes', 'Yes'],
                ['no', 'No'],
                ['unsure', 'Not sure'],
              ]"
              :val.sync="form.info.interestedInIvyLeague"
              label="Are you interested in applying to Ivy League schools?"
            />
            <RadioGroup
              :opts="[
                ['yes', 'Yes'],
                ['no', 'No'],
                ['unsure', 'Not sure'],
              ]"
              :val.sync="form.info.interestedInApplyingAsAthlete"
              label="Are you thinking about applying to universities as a student athlete?"
            />
            <RadioGroup
              :opts="[
                ['full', 'Yes, full scholarship'],
                ['partial', 'Yes, partial scholarship'],
                ['no', 'No'],
                ['unsure', 'I am not sure']
              ]"
              :val.sync="form.info.needsScholarship"
              label="Do you need a scholarship to attend university?"
            />
            <RadioGroup
              :opts="[
                ['unstarted', 'I haven\'t started yet'],
                ['research', 'Initial research'],
                ['list', 'I have a university list'],
                ['essays', 'I started writing essays'],
                ['applying', 'I\'m in the process of applying']
              ]"
              :val.sync="form.info.prepStage"
              label="What stage are you in the university preparation process?*"
            />
            <TextArea
              :val.sync="form.info.question"
              label="What’s one question you want to get answered when it comes to the whole university application process?*"
              sublabel="(e.g. Is IB better than A Level for US unis, What is early application?, etc.)"
              :validators="[
                [null, x => x.length > 0]
              ]"
              @validated="question => setError({question})"
            />

            <label style="display: flex">
              <input v-model="accepttos" type="checkbox" style="margin-right: 20px;">
              <div>
                <span style="display: block; font-weight: 500; margin-bottom: 4px;">I agree to Millie Privacy Policy*</span>
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
          </div>
        </form>
        <!-- {{schools}} -->
      </div>
      <div v-else>
        <h2>Check your inbox for your personal link!</h2>
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
          gradYear: '2022',
          satBefore: true,
          // knowMillie: true,
          knowMillieFrom: 'Other',
          whatsapp: '',
          schoolName: '',
          parent: {
            name1: '',
            name2: '',
            email: '',
            whatsapp: '',
          },
          igHandle: '',
          extraAcademicSupport: 'tutoring',
          tutoringPreference: '1-1',
          essayWritingAbility: 'unsure',
          extracurricularInvolvement: 'medium',
          interestedInMajors: [],
          studyDestinations: [],
          interestedInOxbridge: 'unsure',
          interestedInIvyLeague: 'unsure',
          interestedInApplyingAsAthlete: 'unsure',
          needsScholarship: 'unsure',
          prepStage: 'unstarted',
          question: '',
        }
      },
      country: {},
      parentCountry: {},
      isSubmit: false,
      schools: [],
      errors: {},
      exam: null,
      accepttos: false,
      page: 1,
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
          name2: this.form.name2,
          parent: {
            ...this.form.info.parent,
            fullName: this.form.info.parent.name1 + ' ' + this.form.info.parent.name2
          }
        }
      });
      this.isSubmit = true;
    },
    setError(x) {
      for (const [k, v] of Object.entries(x))
        this.$set(this.errors, k, v)
    },
    switchPage(page) {
      this.page = page;
      this.$nextTick(() => {
        document.getElementsByTagName('html')[0].scrollTop = 0;
      })
      // if (typeof document !== 'undefined') {
      // document.scrollTop = 0;
      // }
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
  border-radius: 10px;
  // margin-bottom: 50px;
  box-shadow: 0px 0px 17px -5px rgba(0, 0, 0, .5);
  padding-bottom: 1px;
  // padding-bottom: 1px;
  @include tablet-up {
    padding-left: 80px;
    padding-right: 80px;
  }
}
.bg {
  background: $primary;
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
form div > * {
  margin-bottom: 25px;
}
button {
  @include flex-center(v);
  display: inline-flex;
  border-radius: 10px;
  font-weight: 500;
  font-size: 1.2rem;
  // background: transparentize($color: #ff4b00, $amount: .94);
  background: $primary;
  color: white;
  padding: .5em 1.1em;
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
.poppins {
  font-family: Poppins !important;
}
</style>
