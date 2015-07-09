/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var env = EmberApp.env();
  var isProductionBuild = (env === 'production');
  var app = new EmberApp(defaults, {
    name: require('./package.json').name,
    getEnvJSON: require('./config/environment'),
    vendorFiles: { 'handlebars.js': false },

    fingerprint: {
      enabled: isProductionBuild,
      prepend: '//d3i8kyz4wwfkbg.cloudfront.net/'
    },
    sourcemaps: {
      enabled: !isProductionBuild,
    },
    minifyCSS: { enabled: isProductionBuild },
    minifyJS: { enabled: isProductionBuild },

    tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionBuild,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionBuild
  });

  app.import('bower_components/normalize-css/normalize.css');

  app.import({
    development: 'bower_components/momentjs/moment.js',
    production: 'bower_components/momentjs/min/moment.min.js'
  });

  app.import({
    development: 'bower_components/showdown/dist/showdown.js',
    production: 'bower_components/showdown/dist/showdown.min.js'
  });

  app.import({
    development: 'bower_components/es6-promise/promise.js',
    production: 'bower_components/es6-promise/promise.min.js'
  });

  app.import('bower_components/fetch/fetch.js');

  app.import({
    development: 'bower_components/usertiming/src/usertiming.js',
    production: 'bower_components/usertiming/dist/usertiming.min.js'
  });

  app.import('vendor/ember-inflector.js');

  return app.toTree();
};
