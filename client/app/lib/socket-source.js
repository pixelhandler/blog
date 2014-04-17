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
    // TODO actually implement the transform interface for PATCH'g
    var inverse = this._cache.transform(operation, true);
    this.didTransform(operation, inverse);
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
      var didFind = function (payload) {
        if (payload.errors || !payload.posts) {
          reject(payload.errors);
        } else {
          resolve(payload.posts[0]);
        }
      };
      try {
        socket.on('error', function (e) {
          var msg = 'SocketSource#_find Error!';
          console.log(msg, e);
          throw new Error(msg, e);
        });
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
    query.resource = query.resource || type + 's';
    query = this._queryFactory(query);

    return new Orbit.Promise(function (resolve, reject) {
      var didFindQuery = function (payload) {
        if (payload.errors || !payload.posts) {
          reject(payload.errors);
        } else {
          resolve(payload.posts);
        }
      };
      try {
        socket.on('error', function (e) {
          var msg = 'SocketSource#_findQuery Error!';
          console.log(msg, e);
          throw new Error(msg, e);
        });
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

  _add: function () { throw new Error('Add not implemented.'); },

  _update: function () { throw new Error('Update not implemented.'); },

  _patch: function () { throw new Error('Patch not implemented.'); },

  _remove: function () { throw new Error('Remove not implemented.'); }
});

module.exports = OC.SocketSource;