const {Nuxt} = require('nuxt-start');

const sls = require('serverless-http');

const config = require('./nuxt.config.js');

const nuxt = new Nuxt({...config, dev: false});

const NuxtServer = (req, res) =>
  nuxt.ready().then(() => nuxt.server.app(req, res));

module.exports.server = sls(NuxtServer, {
  binary: [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml',
  ]
});
