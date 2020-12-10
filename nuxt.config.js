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
    title: 'Millie Exams',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {hid: 'description', name: 'description', content: 'Your go-to place for test prep resources. Answer exam questions and try your hand at SAT, ACT, TOEFL, CAE, A Levels, & more. Join with your school now!' },
      {hid: 'robots', name: 'robots', content: process.env.STAGE === 'production' ? 'all' : 'none'},
      {hid: 'author', name: 'author', content: 'Jude (Mateusz Sowiński) Hunter'},
      {hid: 'keywords', name: 'keywords', content: 'test prep, exams, practice, free, schools, SAT, SAT Math, SAT Reading, SAT Writing, ACT'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' },
      // Montserrat
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400&family=Roboto:wght@400;500&display=swap' },
      {rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.0.5/css/boxicons.min.css'},
      {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css'}
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
