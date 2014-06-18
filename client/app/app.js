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

App.initializer({
  name: 'injectStore',
  initialize: function(container, application) {
    Orbit.Promise = Ember.RSVP.Promise;
    Orbit.ajax = Ember.$.ajax;
    OC.JSONAPISource.prototype.host = Ember.ENV.API_HOST;

    var apiSource = EO.Store.create({
      container: container,
      orbitSourceClass: OC.JSONAPISource
    });
    //debugger;
    new Orbit.TransformConnector(EO.Store.orbitSource, apiSource.orbitSource);
    new Orbit.TransformConnector(apiSource.orbitSource, EO.Store.orbitSource);

    application.register('schema:main', EO.Schema);
    application.register('store:main', EO.Store);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
});

module.exports = Ember.Application.create(Ember.ENV);
