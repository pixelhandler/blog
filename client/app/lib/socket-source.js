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
    var path   = operation.path,
        data   = operation.value,
        type   = path[0],
        id     = path[1];

    if (path.length > 2) {
      path = path.slice(2);
      throw new Error('Nested path not supported.');
    } else {
      var methodName = '_transform' + operation.op.capitalize();
      if (typeof this[methodName] === 'function') {
        delete data.id;
        this[methodName](type, id, data);
      } else {
        throw new Error(methodName + ' not implmented');
      }
    }
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

  _transformAdd: function (type, id, data) {
    var socket = this._socket;
    var payload = { resource: pluralize(type) };
    payload[type] = data;
    id = void 0;

    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didAdd = responseHandlerFactory(resolve, reject);
        socket.emit('add', JSON.stringify(payload), didAdd);
      } catch (e) {
        var msg = 'SocketSource#tranform (op:add) Socket Messaging Error';
        console.log(msg, e);
        throw new Error(msg, e);
      }
    });
  }

  //_add: function () {},
  //_update: function () {},
  //_patch: function () {},
  //_remove: function () {}
});

var responseHandlerFactory = function (resolve, reject) {
  return function (payload) {
    if (payload.errors || !payload.posts) {
      reject(payload.errors);
    } else {
      resolve(payload.posts);
    }
  };
};

var pluralize = function (name) {
  return name + 's';
};

module.exports = OC.SocketSource;
