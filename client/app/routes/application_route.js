'use-strict';

var get = Ember.get, set = Ember.set;
var postIds = 'postIds';

module.exports = App.ApplicationRoute = Ember.Route.extend({

  resource: 'posts',
  total: null,
  limit: 100,
  offset: -100,
  sortBy: 'date',
  order: 'desc',
  //withFields: ['date', 'title', 'slug']

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
    return this.dataSource.find('post', query);
  },

  afterModel: function (collection) {
    var ids = collection.mapBy('id');
    this.meta.set(postIds, ids);
  },

  sessionUrl: Ember.ENV.API_HOST + '/sessions',

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

var queryAttrs = 'limit offset sortBy order';

function setQueryAttributesFromMeta(route, meta) {
  var attrs = Ember.String.w(queryAttrs + ' total');
  attrs.forEach(function (attr) {
    set(route, attr, meta[attr]);
  });
}

function queryFactory(route, query) {
  var attrs = Ember.String.w(queryAttrs + ' resource withFields');
  query = query || {};
  attrs.forEach(function (attr) {
    query[attr] = get(route, attr);
  });
  return query;
}

function loginSuccess(data, status, xhr) {
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'isLoggedIn': true, 'password': null, 'error': null });
  }.bind(controller));
  this.transitionTo('admin.index');
}

function loginFailure(xhr, status, error) {
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'error': error, 'password': null });
  }.bind(controller));
}

function logoutSuccess(data, status, xhr) {
  document.cookie = 'connect.sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'isLoggedIn': false, 'username': null, 'error': null, 'showLogin': false });
  }.bind(controller));
  this.transitionTo('index');
}

function logoutFailure(xhr, status, error) {
  var controller = this.get('controller');
  Ember.run(function () {
    this.setProperties({ 'error': error });
  }.bind(controller));
}
