<template>
  <div>
    <TextInput
      label="WhatsApp number"
      :validators="[
        ['Phone number should be valid for your region', validate],
        [null, x => !!x]
      ]"
      :val="val"
      v-on="$listeners"
    >
      <slot />
    </TextInput>
  </div>
</template>

<script>
import {PhoneNumberFormat as PNF, PhoneNumberUtil, AsYouTypeFormatter} from 'google-libphonenumber';
const phoneUtil = PhoneNumberUtil.getInstance();

export default {
  props: {
    country: Object,
    val: {
      type: String,
      default: ''
    }
  },
  computed: {
    countryCode() {
      return this.country.dial_code;
    },
    asYouType() {
      return new AsYouTypeFormatter(this.countryCode);
    }
  },
  methods: {
    validate(x) {
      // console.log('validate');
      try {
        const string = this.val.substring(this.val.indexOf(' '), this.val.length);
        const number = phoneUtil.parseAndKeepRawInput(string, this.country.code);
        if (phoneUtil.isValidNumberForRegion(number, this.country.code)) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    codeWatch() {
      // console.log('codewatch');
      if (!this.val.startsWith(this.countryCode + ' ')) {
        // console.log('codewatch2');
        this.$emit('update:val', this.countryCode + ' ');
        return true;
      }
    }
  },
  watch: {
    country: {
      deep: false,
      immediate: true,
      handler(n, o) {
        // console.log('test')
        this.$emit('update:val', '');
        this.codeWatch()
      }
    },
    val: {
      immediate: false,
      handler(n, o) {
        if (n === o) return;
        this.codeWatch();
        try {
          const number = phoneUtil.parseAndKeepRawInput(n, this.countryCode);
          const newNumber = phoneUtil.format(number, PNF.INTERNATIONAL);
          if (n !== newNumber) this.$emit('update:val', newNumber);
        } catch (err) {}
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
