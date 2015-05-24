import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  resourceName: 'post',

  beforeModel() {
    const controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model(params) {
    return this.store.find(this.get('resourceName'), params.edit_id);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('isEditing', true);
  }
});
