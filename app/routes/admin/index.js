import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import Post from 'pixelhandler-blog/models/post';
import config from 'pixelhandler-blog/config/environment';

export default Ember.Route.extend(ResetScroll, {
  serviceName: 'posts',

  beforeModel() {
    const controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model() {
    const limit = config.APP.PAGE_LIMIT * 2;
    const service = this.get('serviceName');
    return this[service].find({ query: { 'page[limit]': limit, 'sort': '-date' }});
  },

  afterModel() {
    /* TODO get author?
    const service = this.get('serviceName');

    return this.store.find('author').then(function (authors) {
      const author = authors.get('firstObject');
      this.set('author', author);
    }.bind(this)); */
  },

  actions: {
    destroy(model) {
      this.preventScroll = true;
      this.modelFor('application').removeObject(model);
      this.modelFor('admin.index').removeObject(model);
      return Post.deleteRecord(model, this.get('author')).then(function() {
        this.refresh();
      }.bind(this));
    }
  }
});
