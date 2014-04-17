'use strict';

module.exports = App.AdminRoute = Ember.Route.extend({
  activate: function () {
    var controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  }
});
