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
      },
      // not using Ember Data, TODO figure out if this is needed
      MODEL_FACTORY_INJECTIONS: true
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      PAGE_LIMIT: 10,
      REPORT_METRICS: false,
      API_HOST: '',
      API_HOST_PROXY: '',
      API_PATH: 'api/v1',
      API_AUTH: 'api/auth',
      API_COMMENTER: 'api/commenter',
      COMMENTS_ENABLED: false,
      GOOGLE_ANALYTICS: null
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'font-src': "'self' data: s3.amazonaws.com cdn.pixelhandler.com d3i8kyz4wwfkbg.cloudfront.net",
      'connect-src': "'self'",
      'img-src': "'self' s3.amazonaws.com pixelhandler.com cdn.pixelhandler.com d3i8kyz4wwfkbg.cloudfront.net www.gravatar.com",
      'style-src': "'self' 'unsafe-inline' s3.amazonaws.com cdn.pixelhandler.com d3i8kyz4wwfkbg.cloudfront.net",
      'media-src': "'self' s3.amazonaws.com pixelhandler.com cdn.pixelhandler.com d3i8kyz4wwfkbg.cloudfront.net"
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;

    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.contentSecurityPolicy['connect-src'] = "'self' ws://localhost:35729 localhost:3000";
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
    ENV.APP.API_HOST = 'https://pixelhandler.com';
    ENV.APP.API_HOST_PROXY = 'http://api.pixelhandler.com';
    ENV.APP.API_PATH = 'api/v1';
    ENV.APP.GOOGLE_ANALYTICS = 'UA-2687872-1';
    ENV.APP.REPORT_METRICS = false;
  }

  return ENV;
};
