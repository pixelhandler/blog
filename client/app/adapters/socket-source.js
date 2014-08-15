import Ember from 'ember';
import Orbit from 'orbit';
import OC from 'orbit-common';
import SocketService from '../services/socket';
import JSONAPISerializer from 'orbit-common/jsonapi-serializer';

Orbit.Promise = Orbit.Promise || Ember.RSVP.Promise;

var assert = Orbit.assert;
var Source = OC.Source;

var SocketSource = Source.extend({

  init: function (schema, options) {
    assert('SocketSource requires SocketService be defined', SocketService);
    assert('SocketSource requires Orbit.Promise be defined', Orbit.Promise);
    this._socket = SocketService.create();
    options = options || {};
    if (!options.skipDefaultSerializer) {
      var DefaultSerializerClass = options.defaultSerializerClass || JSONAPISerializer;
      this.defaultSerializer = new DefaultSerializerClass(schema);
    }
    return OC.Source.prototype.init.apply(this, arguments);
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
    var path = operation.path;
    var data = operation.value;
    var type = path[0];
    var socket = this._socket;
    var payload = {};
    var key = pluralize(type);
    payload[key] = data;
    payload = this.serialize(type, payload);
    payload[key] = payload[key][key]; // TODO FIXME
    delete payload[key].id; // Remove client ID created by Orbit.js
    payload.type = type;
    var _this = this;
    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didAdd = responseHandlerFactory(_this, type, resolve, reject);
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
    var path = operation.path;
    var type = path[0];
    var _this = this;
    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didPatch = responseHandlerFactory(_this, type, resolve, reject);
        if (Array.isArray(operation.path)) { // REVIEW why is this needed?
          operation.path = '/' + operation.path.join('/');
        }
        socket.emit('patch', JSON.stringify(operation), didPatch);
      } catch (e) {
        var msg = 'SocketSource#transform (op:patch) Socket Messaging Error';
        console.log(msg, e);
        throw new Error(msg, e);
      }
    }).then(function () {
      _this._transformCache(operation); // REVIEW do we need to call?
    });
  },

  _addRecordsToCache: function(type, records) {
    var _this = this;
    records.forEach(function(record) {
      _this._addRecordToCache(type, record);
    });
  },

  _addRecordToCache: function(type, record) {
    this._transformCache({
      op: 'add',
      path: [type, this.getId(record)],
      value: record
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
    var _this = this;
    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didFind = responseHandlerFactory(_this, type, resolve, reject);
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
    var _this = this;
    return new Orbit.Promise(function (resolve, reject) {
      try {
        var didFindQuery = responseHandlerFactory(_this, type, resolve, reject);
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
  },

  _transformCache: function (operation) {
    var pathToVerify;
    if (operation.op === 'add') {
      pathToVerify = operation.path.slice(0, operation.path.length - 1);
    } else {
      pathToVerify = operation.path;
    }
    if (this.retrieve(pathToVerify)) {
      this._cache.transform(operation);
    } else {
      this.didTransform(operation, []);
    }
  },

  pathForType: function(type) {
    return this.schema.pluralize(type);
  },

  serializerForType: function(/*type*/) {
    return this.defaultSerializer;
  },

  serialize: function(type, data) {
    return this.serializerForType(type).serialize(type, data);
  },

  deserialize: function(type, data) {
    var deserialized = this.serializerForType(type).deserialize(type, data),
        records = deserialized[type];

    if (this._cache) {
      if (Array.isArray(records)) {
        this._addRecordsToCache(type, records);
      } else {
        this._addRecordToCache(type, records);
      }

      if (deserialized.linked) {
        Object.keys(deserialized.linked).forEach(function(relType) {
          this._addRecordsToCache(relType, deserialized.linked[relType]);
        }, this);
      }
    }

    return records;
  }
});

var responseHandlerFactory = function (source, type, resolve, reject) {
  return function (payload) {
    var root = pluralize(type);
    if (payload.errors || !payload[root]) {
      reject(payload.errors);
    } else {
      var data = source.deserialize(type, payload);
      return source.settleTransforms().then(function() {
        return resolve(data);
      });
    }
  };
};

// TODO use Ember.Inflector https://github.com/stefanpenner/ember-inflector.git
var pluralize = function (name) {
  return name + 's';
};

export default SocketSource;
