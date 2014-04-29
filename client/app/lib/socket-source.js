'use-strict';

// Setup Orbit
Orbit.Socket = require('./socket-service');
Orbit.Promise = Orbit.Promise || Ember.RSVP.Promise;

var assert = Orbit.assert;


// Define Orbit source: OC.SocketSource using Orbit.Socket
OC.SocketSource = function() {
  this.init.apply(this, arguments);
};

Orbit.extend(OC.SocketSource.prototype, OC.Source.prototype, {
  constructor: OC.SocketSource,

  init: function (schema, options) {
    assert('SocketSource requires Orbit.Socket be defined', Orbit.Socket);
    assert('SocketSource requires Orbit.Promise be defined', Orbit.Promise);
    this._socket = Orbit.Socket.create();

    return OC.Source.prototype.init.apply(this, arguments);
  },

  initRecord: function(type, record) {
    this.schema.initRecord(type, record);
  },

  _transform: function(operation) {
    var methodName = '_transform' + operation.op.capitalize();
    if (typeof this[methodName] === 'function') {
      return this[methodName](operation);
    } else {
      throw new Error(methodName + ' not implmented');
    }
  },

  _transformAdd: function (operation) {
    var path = operation.path,
      data   = operation.value,
      type   = path[0],
      id     = path[1];

    var socket = this._socket;
    var payload = { resource: pluralize(type) };
    delete data.id;
    payload[type] = data;

    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didAdd = responseHandlerFactory(resolve, reject);
        socket.emit('add', JSON.stringify(payload), didAdd);
      } catch (e) {
        var msg = 'SocketSource#transform (op:add) Socket Messaging Error';
        console.log(msg, e);
        throw new Error(msg, e);
      }
    });
  },

  _transformReplace: function (operation) {
    return this._transformPatch(operation);
  },

  _transformRemove: function (operation) {
    return this._transformPatch(operation);
  },

  _transformPatch: function (operation) {
    var socket = this._socket;

    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didPatch = responseHandlerFactory(resolve, reject);
        if (Array.isArray(operation.path)) { // REVIEW why is this needed?
          operation.path = '/' + operation.path.join('/');
        }
        socket.emit('patch', JSON.stringify(operation), didPatch);
      } catch (e) {
        var msg = 'SocketSource#transform (op:patch) Socket Messaging Error';
        console.log(msg, e);
        throw new Error(msg, e);
      }
    });
  },

  _find: function(type, id) {
    if (id && (typeof id === 'number' || typeof id === 'string')) {
      return this._findOne(type, id);
    } else {
      return this._findQuery(type, id);
    }
  },

  _findOne: function (type, id) {
    var socket = this._socket;
    var query = {resource: type + 's', id: id};

    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didFind = responseHandlerFactory(resolve, reject);
        socket.emit('find', JSON.stringify(query), didFind);
      } catch (e) {
        var msg = 'SocketSource#_find Socket Messaging Error';
        console.log(msg, e);
        throw new Error(msg, e);
      }
    });
  },

  _findQuery: function (type, query) {
    var socket = this._socket;
    query = query || {};
    query.resource = query.resource || pluralize(type);
    query = this._queryFactory(query);

    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didFindQuery = responseHandlerFactory(resolve, reject);
        socket.emit('findQuery', JSON.stringify(query), didFindQuery);
      } catch (e) {
        var msg = 'SocketSource#_findQuery Socket Messaging Error';
        console.log(msg, e);
        throw new Error(msg, e);
      }
    });
  },

  _queryFactory: function (query) {
    var _this = this;
    var attrs = Ember.String.w('limit offset sortBy order resource withFields');
    query = query || {};
    attrs.forEach(function (attr) {
      query[attr] = query[attr] || Ember.get(_this, attr);
    });
    return query;
  },

  _patch: function (type, id, property, value) {
    return OC.Source.prototype._patch.call(this, type, id, property, value);
  },

  _remove: function () {
    return OC.Source.prototype._remove.apply(this, Array.prototype.slice.call(arguments));
  }

});

var responseHandlerFactory = function (resolve, reject) {
  return function (payload) {
    if (payload.errors || !payload.posts) {
      reject(payload.errors);
    } else {
      if (payload.posts.length > 1) {
        resolve(payload.posts.map(function (post) {
          return App.PostModel.create(post);
        }));
      } else {
        resolve(App.PostModel.create(payload.posts[0]));
      }
    }
  };
};

var pluralize = function (name) {
  return name + 's';
};

module.exports = OC.SocketSource;
