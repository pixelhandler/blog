import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  activate: function () {
    var controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  }
});
