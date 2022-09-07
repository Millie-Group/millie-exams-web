<template>
  <div v-click-outside="() => (isFocused = false)">
    <h1>
      {{label}}
    </h1>
    <div class="dropdown">
      <input
        v-if="Object.keys(val).length === 0"
        ref="dropdowninput"
        v-model.trim="inputValue"
        class="dropdown-input"
        placeholder="Start typing to search"
        autocomplete="chrome-off"
        @focus="isFocused = true"
      >
      <div v-else class="dropdown-selected" @click="resetSelection">
        <div class="dropdown-item-flag">
          <FlagIcon :code="val.code.toLowerCase()" />
        </div>
        {{ val.name }}
      </div>
      <div v-show="inputValue || isFocused" class="dropdown-list">
        <div
          v-for="item in itemList"
          v-show="itemVisible(item)"
          :key="item.name"
          class="dropdown-item"
          @click="selectItem(item)"
        >
          <div class="dropdown-item-flag">
            <FlagIcon :code="item.code.toLowerCase()" />
          </div>
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    val: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: 'Country*'
    }
  },
  data() {
    return {
      inputValue: '',
      itemList: [],
      isFocused: false
    };
  },
  async mounted() {
    this.itemList = await (await fetch('/static/countries.json')).json();
  },
  methods: {
    resetSelection() {
      this.$emit('update:val', {});
      this.$nextTick(() => this.$refs.dropdowninput.focus());
    },
    selectItem(theItem) {
      this.inputValue = '';
      this.$emit('update:val', theItem);
      this.isFocused = false;
    },
    itemVisible(item) {
      const currentName = item.name.toLowerCase();
      const currentInput = this.inputValue.toLowerCase();
      return currentName.includes(currentInput);
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  width: 100%;
  // margin-bottom: 25px;
}
.dropdown-input,
.dropdown-selected {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid $primary;
  border-radius: 10px;
  box-shadow: 0 6px 6px rgba(7, 27, 50, 0.1);
  color: black;
  background: white;
  // line-height: 1.5em;
  outline: none;
  // font-weight: 500;
  font-size: 1.3rem;
}
.dropdown-input:focus,
.dropdown-selected:hover {
  background: #fff;
  color: black;
  transition: .1s all ease-in-out;
  border-color: #e2e8f0;
}
.dropdown-selected {
  @include flex-center(v);
  font-weight: 500;
  cursor: pointer;
}
.dropdown-list {
  position: absolute;
  width: 90%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  z-index: 100;
  border-radius: 3px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.1);
}
.dropdown-item {
  @include flex-center(v);
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: $primary;
  color: white;
  transition: .1s all ease-in-out;
}
.dropdown-item-flag {
  max-width: 24px;
  margin-right: 12px;
}
h1 {
  margin-left: 20px;
  font-weight: 500;
  font-size: .9;
  margin-bottom: 6px;
}
</style>
