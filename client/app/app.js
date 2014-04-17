'use-strict';


Ember.Application.initializer({
  name: 'ajax-defaults',

  initialize: function() {
    // Use credentials for session cookies & CORS
    Ember.$.ajaxPrefilter(function(options) {
      options.xhrFields = { withCredentials: true };
    });
  }
});


var SocketService = require('lib/socket-service');

Ember.Application.initializer({
  name: 'socket-service',

  initialize: function (container, application) {
    container.register('socket:main', SocketService, { singleton: false });
    application.inject('controller', 'socket', 'socket:main');
    application.inject('route', 'socket', 'socket:main');
  }
});


var MemorySource = require('lib/memory-source');

Ember.Application.initializer({
  name: 'memory-source',

  initialize: function (container, application) {
    container.register('memorySource:main', MemorySource, {singleton: true});
    application.inject('controller', 'memorySource', 'memorySource:main');
    application.inject('route', 'memorySource', 'memorySource:main');
  }
});


Ember.Application.initializer({
  name: 'store-meta',

  initialize: function (container, application) {
    container.register('storeMeta:main', Ember.Map, {singleton: true});
    application.inject('route', 'meta', 'storeMeta:main');
  }
});


module.exports = Ember.Application.create();
