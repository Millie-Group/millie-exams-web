module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/multiline-html-element-content-newline': 'off',
    'object-curly-spacing': 'off',
    'vue/require-default-prop': 'off',
    'space-before-function-paren': 'off',
    semi: 'off',
    'comma-dangle': 'off',
    curly: 'off',
    'vue/order-in-components': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    'no-unused-vars': 'off'
  }
}
