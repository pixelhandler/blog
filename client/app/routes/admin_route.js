'use strict';

require('../mixins/reset_scroll_mixin');

module.exports = App.AdminRoute = Ember.Route.extend(App.ResetScroll, {
  activate: function () {
    var controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  }
});
