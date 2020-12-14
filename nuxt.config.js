require('dotenv').config();
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  srcDir: 'src/',
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  telemetry: false,
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Study With Millie',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {hid: 'description', name: 'description', content: '' },
      {hid: 'robots', name: 'robots', content: 'none'},
      {hid: 'author', name: 'author', content: 'Jude (Mateusz Sowiński) Hunter'},
      {hid: 'keywords', name: 'keywords', content: ''}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400&family=Roboto:wght@400;500&display=swap' },
      {rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.0.5/css/boxicons.min.css'},
    ],
    script: [
      {
        src: '/static/csv.js'
      }
    ],
  },

  // loading: '~/components/Loading.vue',
  loading: {
    css: false
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    {src: '@/plugins/vuexpersist.js', ssr: false}
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},

  styleResources: {
    scss: [
      '~styles/globals.scss'
    ]
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  // build: {
  //   publicPath: 'https://omvyxegm72.execute-api.us-east-1.amazonaws.com/stage/_nuxt/'
  // },

  // router: {
  //   base: '/stage/'
  // },

  render: {
    compressor: false,
    etag: false,
    static: {}
  }
}
