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

module.exports = Ember.Application.create();
