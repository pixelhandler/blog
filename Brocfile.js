/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
//var mergeTrees = require('broccoli-merge-trees');
//var pickFiles = require('broccoli-static-compiler');
var env = EmberApp.env();

var isProductionBuild = (env === 'production');

var app = new EmberApp({
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
/*
app.import({
  development: 'bower_components/ember-canary/ember.js',
  production:  'bower_components/ember/ember.prod.js'
});
*/
app.import({
  development: 'bower_components/momentjs/moment.js',
  production: 'bower_components/momentjs/min/moment.min.js'
});

app.import({
  development: 'bower_components/showdown/src/showdown.js',
  production: 'bower_components/showdown/compressed/showdown.js'
});

app.import('bower_components/orbit.js/orbit.amd.js', {
  exports: {'orbit': ['default']}
});

app.import('bower_components/orbit.js/orbit-common.amd.js', {
  exports: {'orbit-common': ['default']}
});

app.import('bower_components/orbit.js/orbit-common-jsonapi.amd.js', {
  exports: {'orbit-common/jsonapi-source': ['default'],
            'orbit-common/jsonapi-serializer': ['default'],
            'orbit-common/local-storage-source': ['default']}
});

//app.import('bower_components/orbit.js/orbit-common-local-storage.amd.js', {
  //exports: {'orbit-common/local-storage-source': ['default']}
//});

app.import('bower_components/ember-orbit/ember-orbit.amd.js', {
  exports: {'ember-orbit': ['default']}
});

app.import({
  development: 'bower_components/usertiming/src/usertiming.js',
  production: 'bower_components/usertiming/dist/usertiming.min.js'
});

module.exports = app.toTree();
