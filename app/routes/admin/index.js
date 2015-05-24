import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import Post from 'pixelhandler-blog/models/post';
import config from 'pixelhandler-blog/config/environment';

export default Ember.Route.extend(ResetScroll, {
  resourceName: 'post',

  beforeModel() {
    const controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model() {
    const limit = config.APP.PAGE_LIMIT * 2;
    const resource = this.get('resourceName');
    return this.store.find(resource, { 'page[limit]': limit, 'sort': '-date' });
  },

  afterModel() {
    return this.store.find('author').then(function (authors) {
      const author = authors.get('firstObject');
      this.set('author', author);
    }.bind(this));
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
