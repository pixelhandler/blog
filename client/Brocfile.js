/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
//var mergeTrees = require('broccoli-merge-trees');
//var pickFiles = require('broccoli-static-compiler');
var env = require('broccoli-env').getEnv();

var options = {
  name: require('./package.json').name,
  getEnvJSON: require('./config/environment')//,
  //vendorFiles: { 'handlebars.js': false }
};

if (env === 'production') {
  options.minifyCSS = {
    enabled: true,
    options: {}
  };
  options.fingerprint = {
    enabled: true,
    replaceExtensions: ['html'],
    prepend: '//s3.amazonaws.com/cdn.pixelhandler.com/'
  };
} else {
  options.minifyCSS = {
    enabled: false
  };
  options.fingerprint = {
    enabled: false
  };
}

var app = new EmberApp(options);

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

app.import('bower_components/socket.io-client/socket.io.js');

app.import({
  development: 'bower_components/usertiming/src/usertiming.js',
  production: 'bower_components/usertiming/dist/usertiming.min.js'
});

module.exports = app.toTree();
