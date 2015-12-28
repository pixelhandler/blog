import Ember from 'ember';
import config from '../config/environment';

var ApplicationRoute = Ember.Route.extend({

  model() {
    const limit = config.APP.PAGE_LIMIT;
    const options = { 'query': { 'page[limit]': limit, 'sort': '-date' }};
    return this.store.find('posts', options);
  },

  afterModel(model) {
    this.posts.cache.resources = model;
    return null;
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.canTransition = false;
  },

  actions: {
    error(error, e) {
      console.log(error.stack);
      Ember.Logger.error(error, e);
      this.transitionTo('not-found');
    }
  }
});

export default ApplicationRoute;
