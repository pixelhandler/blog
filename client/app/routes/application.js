import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var w = Ember.String.w;
var post = Ember.$.post;
var ajax = Ember.$.ajax;
var postIds = 'postIds';

var ApplicationRoute = Ember.Route.extend({

  resource: 'posts',
  total: null,
  limit: 10,
  offset: -10,
  sortBy: 'date',
  order: 'desc',
  //withFields: ['date', 'title', 'slug']

  meta: Ember.Map.create(),

  beforeModel: function () {
    var offset = get(this, 'offset') + get(this, 'limit');
    set(this, 'offset', offset);

    var meta = this.meta;
    if (!meta.get(postIds)) {
      meta.set(postIds, []);
    }
  },

  model: function () {
    var query = queryFactory(this);
    return this.store.find('post', query);
  },

  afterModel: function (collection) {
    var ids = collection.mapBy('id');
    this.meta.set(postIds, ids);
  },

  sessionUrl: (function() {
    var uri = [ PixelhandlerBlogENV.API_HOST ];
    if (PixelhandlerBlogENV.API_PATH) { uri.push(PixelhandlerBlogENV.API_PATH); }
    uri.push('sessions');
    return uri.join('/');
  }()),

  onDidAdd: function () {
    try {
      this.socket.on('didAdd', this.addToCollections.bind(this));
    } catch (e) {
      console.log(e);
    }
  }.on('init'),

  addToCollections: function (payload) {
    var resource = get(this, 'resource');
    var routeNames = 'application postsIndex';
    w(routeNames).forEach(function (name) {
      try {
        this.modelFor(name).addObject(payload[resource][0]);
      } catch (e) {
        console.log(e);
      }
    }.bind(this));
  },

  actions: {
    login: function () {
      var controller = this.get('controller');
      post(this.get('sessionUrl'), {
        username: controller.get('username'),
        password: controller.get('password')
      })
        .done(loginSuccess.bind(this))
        .fail(loginFailure.bind(this));
    },

    logout: function () {
      ajax({ url: this.get('sessionUrl'), type: 'DELETE' })
        .done(logoutSuccess.bind(this))
        .fail(logoutFailure.bind(this));
    }
  }
});

var queryAttrs = 'limit offset sortBy order';

function queryFactory(route, query) {
  var attrs = w(queryAttrs + ' resource withFields');
  query = query || {};
  attrs.forEach(function (attr) {
    query[attr] = get(route, attr);
  });
  return query;
}

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
