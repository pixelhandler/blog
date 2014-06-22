import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['application'],

  isLoggedInBinding: 'controllers.application.isLoggedIn'
});
