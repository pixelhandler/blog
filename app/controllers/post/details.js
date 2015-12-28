import Ember from 'ember';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),

  isLoggedInBinding: 'applicationController.isLoggedIn'
});

