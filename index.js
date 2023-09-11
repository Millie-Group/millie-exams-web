const {Nuxt, ...rest} = require('nuxt-start');
console.log(rest);
const config = require('./nuxt.config.js');

const nuxt = new Nuxt({...config, dev: false});
nuxt.listen(process.port || 3000)
