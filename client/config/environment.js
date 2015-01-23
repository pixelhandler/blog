/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'pixelhandler-blog',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      USE_SOCKET_ADAPTER: true
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' a.disquscdn.com",
      'font-src': "'self' data: s3.amazonaws.com cdn.pixelhandler.com",
      'connect-src': "'self'",
      'img-src': "'self' s3.amazonaws.com cdn.pixelhandler.com",
      'style-src': "'self' 'unsafe-inline' s3.amazonaws.com cdn.pixelhandler.com"
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;

    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.contentSecurityPolicy['connect-src'] = "'self' ws://localhost:35729 localhost:8888 ws://localhost:8888";

    ENV.APP.API_HOST = 'http://localhost:8888';
    ENV.APP.API_PATH = null;
    ENV.APP.SOCKET_URL = "ws://localhost:8888";
    ENV.APP.GOOGLE_ANALYTICS = null;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.API_HOST = "http://pixelhandler.com";
    ENV.APP.API_PATH = "api";
    ENV.APP.SOCKET_URL = "ws://pixelhandler.com";
    ENV.APP.GOOGLE_ANALYTICS = "UA-2687872-1";
  }

  return ENV;
};
