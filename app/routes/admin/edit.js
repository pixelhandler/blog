import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  beforeModel() {
    const controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model(params) {
    return this.posts.find(params.edit_id);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('isEditing', true);
  }
});
