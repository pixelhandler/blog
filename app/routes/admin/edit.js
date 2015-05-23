import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  resourceName: 'post',

  beforeModel: function () {
    var controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model: function (params) {
    return this.store.find(this.get('resourceName'), params.edit_id);
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('isEditing', true);
  }
});
