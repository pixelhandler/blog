/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var autoprefixer = require('autoprefixer');
var cssnext = require('postcss-cssnext');
var nested = require('postcss-nested');
var cssImport = require("postcss-import")

module.exports = function(defaults) {
  var env = EmberApp.env();
  var isProductionBuild = (env === 'production');
  var app = new EmberApp(defaults, {
    name: require('./package.json').name,
    getEnvJSON: require('./config/environment'),
    fingerprint: { enabled: isProductionBuild, prepend: '//d3i8kyz4wwfkbg.cloudfront.net/' },
    sourcemaps: { enabled: !isProductionBuild },
    minifyCSS: { enabled: isProductionBuild },
    minifyJS: { enabled: isProductionBuild },
    tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionBuild,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionBuild,
    postcssOptions: {
      plugins: [
        {
          module: autoprefixer,
          options: {
            browsers: ['last 2 version']
          }
        },
        { module: cssImport },
        { module: nested },
        {
          module: cssnext,
          options: {
            sourcemap: true
          }
        }
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/normalize-css/normalize.css');

  return app.toTree();
};
