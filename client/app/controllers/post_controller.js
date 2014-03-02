'use-strict';

module.exports = App.PostController = Ember.ObjectController.extend({
  needs: ['application'],

  isLoggedInBinding: 'controllers.application.isLoggedIn'
});
