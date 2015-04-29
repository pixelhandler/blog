import Ember from 'ember';

export default Ember.Controller.extend({

  username: null,
  password: null,
  error: null,
  showLogin: false,
  isLoggedIn: false,

  isTwoColumns: true,

  asideDisplayButton: function () {
    return (this.get('isTwoColumns')) ? 'one column' : 'two columns';
  }.property('isTwoColumns'),

  actions: {
    toggleAside: function () {
      this.toggleProperty('isTwoColumns');
    },

    enableAdmin: function () {
      this.set('showLogin', true);
      return false;
    },

    disableAdmin: function () {
      this.set('showLogin', false);
      return false;
    },

    login: function (view) {
      this.setProperties({
        username: view.$('input[name="username"]').val(),
        password: view.$('input[name="password"]').val()
      });
      return true;
    }
  }
});
