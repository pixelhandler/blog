import Ember from 'ember';
import PushSupport from '../mixins/push-support';
import config from '../config/environment';

var ApplicationRoute = Ember.Route.extend(PushSupport, {

  beforeModel: function (transition) {
    if (typeof this._pingOk === 'undefined') {
      Ember.$.get(this.get('pingUrl'))
        .fail(function (e) {
          transition.send('error', 'pingFailed', e);
          this._pingOk = false;
        }.bind(this))
        .done(function () {
          this._pingOk = true;
        }.bind(this));
    }
    this.socketSanityCheck();
    return this._super();
  },

  model: function () {
    return this.store.find('post');
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    this.canTransition = false;
    var socket = lookupSocket(this.container);
    if (socket) {
      socket.emit('isLoggedIn', function(isLoggedIn) {
        if (isLoggedIn) {
          loginSuccess.call(this);
        }
      }.bind(this));
    } else {
      Ember.$.get(this.get('sessionUrl'))
        .done(loginSuccess.bind(this));
    }
  },

  sessionUrl: (function() {
    var uri = [ config.APP.API_HOST ];
    if (config.APP.API_PATH) { uri.push(config.APP.API_PATH); }
    uri.push('sessions');
    return uri.join('/');
  }()),

  pingUrl: (function() {
    var uri = [ config.APP.API_HOST ];
    if (config.APP.API_PATH) { uri.push(config.APP.API_PATH); }
    uri.push('ping');
    return uri.join('/');
  }()),

  // Push support...

  onDidPatch: function () {
    try {
      this.socket.on('didPatch', this.patchRecord.bind(this));
    } catch (e) {
      console.warn('Push support not enabled for application route.');
    }
  }.on('init'),

  addLink: function (operation) {
    this._addLink(operation);
  },

  removeLink: function (operation) {
    this._removeLink(operation);
  },

  addRecord: function (operation) {
    this._addRecord(operation);
  },

  updateAttribute: function (operation) {
    this._updateAttribute(operation);
  },

  deleteRecord: function (operation) {
    this._deleteRecord(operation);
  },

  actions: {
    login: function () {
      var controller = this.get('controller');
      this.canTransition = true;
      var credentails = JSON.stringify({
        username: controller.get('username'),
        password: controller.get('password')
      });
      var socket = lookupSocket(this.container);
      if (socket) {
        socket.emit('login', credentails, function didLogin(succeed) {
          if (succeed) {
            loginSuccess.call(this);
          } else {
            loginFailure.call(this);
          }
        }.bind(this));
      } else {
        Ember.$.ajax({
          url: this.get('sessionUrl'),
          type: 'POST',
          data: credentails,
          dataType: 'text',
          contentType: 'application/json'
        })
          .done(loginSuccess.bind(this))
          .fail(loginFailure.bind(this));
      }
      return false;
    },

    logout: function () {
      var socket = lookupSocket(this.container);
      if (socket) {
        socket.emit('logout', function didLogout(succeed) {
          if (succeed) {
            logoutSuccess.call(this);
          } else {
            logoutFailure.call(this);
          }
        }.bind(this));
      } else {
        Ember.$.ajax({
          url: this.get('sessionUrl'),
          type: 'DELETE'
        })
          .done(logoutSuccess.bind(this))
          .fail(logoutFailure.bind(this));
      }
    },

    error: function (error, e) {
      Ember.Logger.error(error, e);
      if (error === 'pingFailed') {
        this.transitionTo('offline');
        window.alert('The API server is offline, perhaps tweet @pixelhandler');
      } else {
        this.transitionTo('not-found');
      }
    }
  }

});

function lookupSocket(container) {
  if (!window.WebSocket) {
    return false;
  }
  return container.lookup('socket:main');
}

function loginSuccess() {
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'isLoggedIn': true, 'password': null, 'error': null });
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

export default ApplicationRoute;
