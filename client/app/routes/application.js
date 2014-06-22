import Ember from 'ember';

var ApplicationRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('post');
  },

  sessionUrl: (function() {
    var uri = [ PixelhandlerBlogENV.API_HOST ];
    if (PixelhandlerBlogENV.API_PATH) { uri.push(PixelhandlerBlogENV.API_PATH); }
    uri.push('sessions');
    return uri.join('/');
  }()),

  actions: {
    login: function () {
      var controller = this.get('controller');
      Ember.$.post(this.get('sessionUrl'), {
        username: controller.get('username'),
        password: controller.get('password')
      })
        .done(loginSuccess.bind(this))
        .fail(loginFailure.bind(this));
    },

    logout: function () {
      Ember.$.ajax({ url: this.get('sessionUrl'), type: 'DELETE' })
        .done(logoutSuccess.bind(this))
        .fail(logoutFailure.bind(this));
    }
  }
});

function loginSuccess(/*data, status, xhr*/) {
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'isLoggedIn': true, 'password': null, 'error': null });
  }.bind(controller));
  this.transitionTo('admin.index');
}

function loginFailure(xhr, status, error) {
  var controller = this.get('controller');
  xhr = xhr || void 0;
  status = status || void 0;
  Ember.run(function () {
    this.setProperties({ 'error': error, 'password': null });
  }.bind(controller));
}

function logoutSuccess(/*data, status, xhr*/) {
  document.cookie = 'connect.sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'isLoggedIn': false, 'username': null, 'error': null, 'showLogin': false });
  }.bind(controller));
  this.transitionTo('index');
}

function logoutFailure(xhr, status, error) {
  xhr = xhr || void 0;
  status = status || void 0;
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'error': error });
  }.bind(controller));
}

export default ApplicationRoute;
