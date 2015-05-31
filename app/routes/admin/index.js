import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
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
    return this.store.find('posts', { query: { 'page[limit]': limit, 'sort': '-date' }});
  },

  actions: {
    destroy(model) {
      this.preventScroll = true;
      this.modelFor('application').removeObject(model);
      this.modelFor('admin.index').removeObject(model);
      return this.store.deleteResource('posts', model).then(function() {
        this.refresh();
      }.bind(this)).catch(function(e) {
        console.error(e);
      });
    }
  }
});
