import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import Post from '../../models/post';

export default Ember.Route.extend(ResetScroll, {
  resourceName: 'post',

  beforeModel: function () {
    var controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model: function () {
    return this.store.find(this.get('resourceName'));
  },

  afterModel: function () {
    return this.store.find('author').then(function (authors) {
      var author = authors.get('firstObject');
      this.set('author', author);
    }.bind(this));
  },

  actions: {
    destroy: function (model) {
      this.preventScroll = true;
      this.modelFor('application').removeObject(model);
      this.modelFor('admin.index').removeObject(model);
      return Post.deleteRecord(model, this.get('author')).then(function() {
        this.refresh();
      }.bind(this));
    }
  }
});
