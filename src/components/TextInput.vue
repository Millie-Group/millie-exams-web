<template>
  <div>
    <h1 v-if="label">
      {{label}}
    </h1>
    <input v-bind="$attrs" :value="val" @input="x => $emit('update:val', x.target.value)">
    <div class="validation-hints">
      <FormValidationHint v-for="([name, correct, vanish], idx) in validationHints.filter(([n]) => n != null && n.length)" :key="idx" :correct="correct" :hide="vanish">
        {{name}}
      </FormValidationHint>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    val: null,
    validators: {
      type: Array,
      default: () => ([])
    },
    validatordeps: {
      type: Array,
      default: () => ([])
    },
    label: null
  },
  data() {
    return {
      validationHints: []
    }
  },
  computed: {
    valueAndDeps() {
      return [this.val, ...this.validatordeps]
    }
  },
  watch: {
    valueAndDeps: {
      immediate: true,
      deep: true,
      handler(n) {
        const hints = this.validators.map(([text, v, vanish]) => {
          return [text, v(this.val), vanish?.(this.val)];
        });
        this.validationHints = hints;
        this.$emit('validated', hints.filter(([_, val]) => !val).length === 0);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  padding: 8px 20px;
  font-size: 0.9rem;
  border: 2px solid $primary;
  border-radius: 10px;
  // box-shadow: 0 6px 6px transparentize($color: $primary, $amount: .9);
  // margin-bottom: 25px;
}
h1 {
  margin-left: 20px;
  font-weight: 500;
  font-size: .9;
  margin-bottom: 6px;
}
.validation-hints {
  margin-top: 7px;
}
</style>
