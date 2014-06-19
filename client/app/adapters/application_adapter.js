'use-strict';

module.exports = App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: Ember.ENV.API_HOST,
  namespace: Ember.ENV.API_PATH
});
