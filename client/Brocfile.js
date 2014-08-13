/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
//var mergeTrees = require('broccoli-merge-trees');
//var pickFiles = require('broccoli-static-compiler');
var env = require('broccoli-env').getEnv();

var options = {
  name: require('./package.json').name,
  getEnvJSON: require('./config/environment')
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

app.import('vendor/normalize-css/normalize.css');
/*
app.import({
  development: 'vendor/ember-canary/ember.js',
  production:  'vendor/ember/ember.prod.js'
});
*/
app.import({
  development: 'vendor/momentjs/moment.js',
  production: 'vendor/momentjs/min/moment.min.js'
});

app.import({
  development: 'vendor/showdown/src/showdown.js',
  production: 'vendor/showdown/compressed/showdown.js'
});

app.import('vendor/orbit.js/orbit.amd.js', {
  exports: {'orbit': ['default']}
});

app.import('vendor/orbit.js/orbit-common.amd.js', {
  exports: {'orbit-common': ['default']}
});

app.import('vendor/orbit.js/orbit-common-jsonapi.amd.js', {
  exports: {'orbit-common/jsonapi-source': ['default'],
            'orbit-common/jsonapi-serializer': ['default'],
            'orbit-common/local-storage-source': ['default']}
});

//app.import('vendor/orbit.js/orbit-common-local-storage.amd.js', {
  //exports: {'orbit-common/local-storage-source': ['default']}
//});

app.import('vendor/ember-orbit/ember-orbit.amd.js', {
  exports: {'ember-orbit': ['default']}
});

app.import('vendor/socket.io-client/socket.io.js');

module.exports = app.toTree();
