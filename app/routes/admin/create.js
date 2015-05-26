import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import Post from 'pixelhandler-blog/models/post';

export default Ember.Route.extend(ResetScroll, {
  beforeModel() {
    const controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model() {
    return Post.newRecord();
  },

  afterModel() {
    return this.store.find('author').then(function (authors) {
      const id = authors.get('firstObject').get('id');
      this.setProperties({'authorId': id, 'authors': authors});
    }.bind(this));
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      'dateInput': moment().format('L'),
      'authorId': this.get('authorId'),
      'authors': this.get('authors')
    });
  },

  actions: {
    save(newModel, authorId) {
      Post.createRecord(this.store, newModel, authorId);
      this.store.then(function () {
        this.transitionTo('admin.index');
      }.bind(this));
    },

    cancel() {
      this.transitionTo('admin.index');
    }
  },

  deactivate() {
    this.modelFor('admin.create').destroy();
  }
});
