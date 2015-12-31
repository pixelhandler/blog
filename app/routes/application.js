import Ember from 'ember';
import config from '../config/environment';

var ApplicationRoute = Ember.Route.extend({

  model() {
    const limit = config.APP.PAGE_LIMIT;
    const options = {
      query: {
        'page[limit]': limit,
        sort: '-date',
        include: 'tags'
      }
    };
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
      Ember.Logger.error(error, e);
      Ember.Logger.info(error.stack);
      this.transitionTo('not-found');
    },

    doSearch(term) {
      if (this.router.currentRouteName !== 'excerpts') {
        let url = ['//', window.location.host, '/?search=', term].join('');
        window.location = url;
      }
    },

    home() {
      this.transitionTo('/');
    }
  }
});

export default ApplicationRoute;
