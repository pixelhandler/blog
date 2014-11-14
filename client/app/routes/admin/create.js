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

  afterModel: function (model) {
    return this.store.find('author').then(function (authors) {
      var id = authors.get('firstObject').get('id');
      model.set('links.author', id);
    });
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('dateInput', moment().format('L'));
  },

  actions: {
    save: function (newModel, authorId) {
      Post.createRecord(this.store, newModel, authorId).then(function () {
        this.transitionTo('admin.index');
      }.bind(this));
    },

    cancel: function () {
      this.transitionTo('admin.index');
    }
  }

});
