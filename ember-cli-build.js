/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var autoprefixer = require('autoprefixer');
var cssnext = require('postcss-cssnext');
var nested = require('postcss-nested');
var cssImport = require('postcss-import');
var emberTesting = process.env.EMBER_CLI_TEST_COMMAND;
var isPreflight = (process.env.PREFLIGHT === 'true');

module.exports = function(defaults) {
  var env = EmberApp.env();
  var isProductionBuild = (env === 'production');
  var options = {
    fingerprint: { enabled: isProductionBuild },
    sourcemaps: { enabled: !isProductionBuild },
    minifyCSS: { enabled: isProductionBuild },
    minifyJS: { enabled: isProductionBuild },
    tests: emberTesting || !isProductionBuild,
    hinting: emberTesting || !isProductionBuild,
    postcssOptions: {
      plugins: [
        { module: autoprefixer, options: { browsers: ['last 2 version'] } },
        { module: cssImport },
        { module: nested },
        { module: cssnext, options: { sourcemap: true } }
      ]
    }
  };

  if (!isPreflight) {
    options.fingerprint.prepend = '//d3i8kyz4wwfkbg.cloudfront.net/';
  }

  var app = new EmberApp(defaults, options);

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

  app.import('bower_components/normalize.css/normalize.css');

  return app.toTree();
};
