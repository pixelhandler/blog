import Ember from 'ember';
import RenderUsingTimings from '../mixins/render-using-timings';
import { mark, measure } from '../utils/metrics';
import config from '../config/environment';
import uuid from '../utils/uuid';

var ApplicationRoute = Ember.Route.extend(RenderUsingTimings, {

  activate: function() {
    if (!window.localStorage.getItem('visitor')) {
      window.localStorage.setItem('visitor', uuid());
    }
  },

  beforeModel: function () {
    /* TODO implement method to check for active authtoken
    Ember.$.get(this.get('authUrl'))
      .done(loginSuccess.bind(this));*/
    return this._super();
  },

  model: function () {
    if (config.APP.REPORT_METRICS) {
      mark('mark_begin_find_post_records');
    }
    return this.store.find('post');
  },

  afterModel() {
    if (config.APP.REPORT_METRICS) {
      mark('mark_end_find_post_records');
      measure('find_posts', 'mark_begin_find_post_records', 'mark_end_find_post_records');
    }
    return null;
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    this.canTransition = false;
  },

  measurementName: 'application_view',
  reportUserTimings: false,

  authUrl: (function() {
    var uri = [ config.APP.API_HOST ];
    if (config.APP.API_PATH) { uri.push(config.APP.API_PATH); }
    uri.push('auth');
    return uri.join('/');
  }()),

  actions: {
    login: function () {
      var controller = this.get('controller');
      this.canTransition = true;
      var credentails = JSON.stringify({
        username: controller.get('username'),
        password: controller.get('password')
      });
      Ember.$.ajax({
        url: this.get('authUrl'),
        type: 'POST',
        data: credentails,
        dataType: 'text',
        contentType: 'application/json'
      })
        .done(loginSuccess.bind(this))
        .fail(loginFailure.bind(this));
      return false;
    },

    logout: function () {
      window.localStorage.remoteItem('AuthorizationHeader');
      /* TODO re-implement logout
      Ember.$.ajax({
        url: this.get('authUrl'),
        type: 'DELETE'
      })
        .done(logoutSuccess.bind(this))
        .fail(logoutFailure.bind(this));
      */
    },

    error: function (error, e) {
      console.log(error.stack);
      Ember.Logger.error(error, e);
      /*if (error === 'pingFailed') {
        this.transitionTo('offline');
        window.alert('The API server is offline, perhaps tweet @pixelhandler');
      } else {
        this.transitionTo('not-found');
      }*/
      this.transitionTo('not-found');
    }
  }

});


function loginSuccess(data) {
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'isLoggedIn': true, 'password': null, 'error': null });
    window.localStorage.setItem('AuthorizationHeader', data.auth_token);
  }.bind(controller));
  if (this.canTransition) {
    this.transitionTo('admin.index');
  }
}

function loginFailure(xhr, status, error) {
  var controller = this.get('controller');
  xhr = xhr || void 0;
  status = status || void 0;
  Ember.run(function () {
    this.setProperties({ 'error': error, 'password': null });
  }.bind(controller));
}
/* TODO re-implement logout
function logoutSuccess() {
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
*/
export default ApplicationRoute;
