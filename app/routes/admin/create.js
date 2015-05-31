import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import Resource from 'pixelhandler-blog/models/post';

export default Ember.Route.extend(ResetScroll, {
  beforeModel() {
    const controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model() {
    const resource = Resource.create({isNew: true});
    this.store.find('authors').then(function (authors) {
      const author = authors.get('firstObject');
      this.set('author', author);
      resource.addRelationship('author', author.get('id'));
    }.bind(this));
    return resource;
  },

  setupController(controller, resource) {
    this._super(controller, resource);
    controller.setProperties({
      'dateInput': moment().format('L'),
    });
  },

  actions: {
    save(resource) {
      this.store.createResource('posts', resource).then(function(resp) {
        resource.destroy();
        this.modelFor('admin.index').addObject(resp);
        this.modelFor('application').addObject(resp);
        this.modelFor('index').addObject(resp);
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
