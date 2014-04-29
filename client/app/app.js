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


var Model = require('lib/model');

Ember.Application.initializer({
  name: 'model',

  initialize: function(container, application) {
    application.register('model:main', Model, { singleton: false });
  }
});


var SocketService = require('lib/socket-service');

Ember.Application.initializer({
  name: 'socket-service',

  initialize: function (container, application) {
    container.register('socket:main', SocketService, { singleton: false });
    application.inject('controller', 'socket', 'socket:main');
    application.inject('route', 'socket', 'socket:main');
    var model = container.lookup('model:main');
    model.constructor.prototype.socket = container.lookup('socket:main');
  }
});


var DataSource = require('lib/data_source');

Ember.Application.initializer({
  name: 'data-source',

  initialize: function (container, application) {
    container.register('dataSource:main', DataSource, {singleton: true});
    application.inject('controller', 'dataSource', 'dataSource:main');
    application.inject('route', 'dataSource', 'dataSource:main');
    var model = container.lookup('model:main');
    model.constructor.prototype.dataSource = container.lookup('dataSource:main');
  }
});


Ember.Application.initializer({
  name: 'data-source-meta',

  initialize: function (container, application) {
    container.register('dataSource:meta', Ember.Map, {singleton: true});
    application.inject('route', 'meta', 'dataSource:meta');
  }
});


module.exports = Ember.Application.create();
