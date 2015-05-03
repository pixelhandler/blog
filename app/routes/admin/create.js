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
    return Post.newRecord();
  },

  afterModel: function () {
    return this.store.find('author').then(function (authors) {
      const id = authors.get('firstObject').get('id');
      this.setProperties({'authorId': id, 'authors': authors});
    }.bind(this));
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.setProperties({
      'dateInput': moment().format('L'),
      'authorId': this.get('authorId'),
      'authors': this.get('authors')
    });
  },

  actions: {
    save: function (newModel, authorId) {
      Post.createRecord(this.store, newModel, authorId);
      this.store.then(function () {
        this.transitionTo('admin.index');
      }.bind(this));
    },

    cancel: function () {
      this.transitionTo('admin.index');
    }
  },

  deactivate: function () {
    this.modelFor('admin.create').destroy();
  }
});
