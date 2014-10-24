import Ember from 'ember';
import Orbit from 'orbit';
import OC from 'orbit-common';
import SocketService from '../services/socket';
import JSONAPISource from 'orbit-common/jsonapi-source';

Orbit.Promise = Orbit.Promise || Ember.RSVP.Promise;

var SocketSource = JSONAPISource.extend({

  init: function (schema, options) {
    Orbit.assert('SocketSource requires SocketService be defined', SocketService);
    Orbit.assert('SocketSource requires Orbit.Promise be defined', Orbit.Promise);
    Orbit.assert('SocketSource only supports usePatch option', this.usePatch);
    this._socket = SocketService.create();
    this.initSerializer(schema, options);
    // not calling super, instead calling template/abstract prototype init method
    return OC.Source.prototype.init.apply(this, arguments);
  },

  initSerializer: function (schema, options) {
    // See JSONAPISource
    this.SerializerClass = options.SerializerClass || this.SerializerClass;
    if (this.SerializerClass && this.SerializerClass.wrappedFunction) {
      this.SerializerClass = this.SerializerClass.wrappedFunction;
    }
    this.serializer = new this.SerializerClass(schema);
  },

  // using JSONPatch via WebSocket
  usePatch: true,

  // Requestable interface implementation

  _find: function(type, id) {
    if (id && (typeof id === 'number' || typeof id === 'string')) {
      return this._findOne(type, id);
    } else {
      return this._findQuery(type, id);
    }
  },

  _findLink: function() {
    throw new Error('SocketSource#_findLink not supported');
  },
  // TODO ? _findLinked

  // Requestable Internals

  _findOne: function (type, id) {
    var query = this._queryFactory(type, { id: id });

    return this._remoteFind('find', type, query);
  },

  _findMany: function () {
    throw new Error('SocketSource#_findMany not supported');
  },

  _findQuery: function (type, query) {
    query = this._queryFactory(type, query);

    return this._remoteFind('findQuery', type, query);
  },

  _remoteFind: function (channel, type, query) {
    var root = pluralize(type);
    var id = query.id;
    query = JSON.stringify(query);
    return new Orbit.Promise(function doFind(resolve, reject) {
      this._socket.emit(channel, query, function didFind(raw) {
        if (raw.errors || !raw[root]) {
          reject(raw.errors);
        } else {
          resolve(raw);
        }
      });
    }.bind(this))
      .then(function doProcess(raw) {
        var data = this.deserialize(type, id, raw);
        this.settleTransforms();
        return data;
      }.bind(this))
      .catch(function onError(error) {
        console.error(error);
        throw new Error('SocketSource#_remoteFind Error w/ query: ' + query);
      });
  },

  _queryFactory: function (type, query) {
    query = query || {};
    query.resource = query.resource || pluralize(type);

    var attrs = Ember.String.w('limit offset sortBy order resource withFields');
    attrs.forEach(function (attr) {
      query[attr] = query[attr] || Ember.get(this, attr);
    }.bind(this));

    return query;
  },

  // Transformable Internals

  _transformAdd: function (operation) {
    var type = operation.path[0];
    var id = operation.path[1];
    var remoteOp = {
      op: 'add',
      path: ['/', type, (id) ? '/' + id : ''].join(''),
      value: this.serializer.serializeRecord(type, operation.value)
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _transformReplace: function (operation) {
    var type = operation.path[0];
    var id = operation.path[1];
    var remoteOp = {
      op: 'replace',
      path: '/' + operation.path.join('/'),
      value: this.serializer.serializeRecord(type, operation.value)
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _transformRemove: function (operation) {
    var type = operation.path[0];
    var id = operation.path[1];
    var remoteOp = {
      op: 'remove',
      path: '/' + operation.path.join('/')
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _transformUpdateAttribute: function (operation) {
    var type = operation.path[0];
    var id = operation.path[1];
    var remoteOp = {
      op: 'replace',
      path: '/' + operation.path.join('/'),  // includes attr in path
      value: operation.value
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _transformAddLink: function (operation) {
    //throw new Error('SocketSource#_transformAddLink not supported');
    debugger;
    var type = operation.path[0];
    var id = operation.path[1];
    var link = operation.path[3];
    var relId = operation.path[4] || operation.value;
    var linkDef = this.schema.models[type].links[link];
    var relType = linkDef.model;
    var relResourceId = this.resourceId(relType, relId);
    var remoteOp = {
      path: operation.path,
      op: (linkDef.type === 'hasMany') ? 'add' : 'replace',
      value: relResourceId
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _transformRemoveLink: function (operation) {
    //throw new Error('SocketSource#_transformRemoveLink not supported');
    debugger;
    var type = operation.path[0];
    var id = operation.path[1];
    var remoteOp = {
      op: 'remove',
      path: '/' + operation.path.join('/').replace(/__rel/, 'links')
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _transformReplaceLink: function (operation) {
    //throw new Error('SocketSource#_transformReplaceLink not supported');
    debugger;
    var type = operation.path[0];
    var id = operation.path[1];
    var link = operation.path[3];
    var relId = operation.path[4] || operation.value;
    // Convert a map of ids to an array
    if (isObject(relId)) {
      relId = Object.keys(relId);
    }
    var linkDef = this.schema.models[type].links[link];
    var relType = linkDef.model;
    var relResourceId = this.resourceId(relType, relId);
    var remoteOp = {
      op: 'replace',
      path: '/' + operation.path.join('/').replace(/__rel/, 'links'),
      value: relResourceId
    };
    return this._remotePatch(type, id, remoteOp);
  },

  _remotePatch: function (type, id, remoteOp) {
    //console.log('remoteOp', remoteOp);
    var root = pluralize(type);
    return new Orbit.Promise(function doPatch(resolve, reject) {
      this._socket.emit('patch', JSON.stringify(remoteOp), function didPatch(raw) {
        if (raw.errors || !raw[root]) {
          reject(raw.errors);
        } else {
          resolve(raw);
        }
      });
    }.bind(this))
      .then(function doProcess(raw) {
        var data = null;
        if (raw && Array.isArray(raw)) {
          data = this.deserialize(type, id, raw[0]);
          this.settleTransforms();
        } else {
          this._transformCache(remoteOp);
        }
        return data;
      }.bind(this))
      .catch(function onError(error) {
        console.error(error);
        throw new Error('SocketSource#_remotePatch op:' + remoteOp.op + ' Error');
      });
  }

});

// TODO use Ember.Inflector https://github.com/stefanpenner/ember-inflector.git
var pluralize = function (name) {
  return name + 's';
};
// borrowed from 'orbit/lib/objects'
var isObject = function(obj) {
  return obj !== null && typeof obj === 'object';
};

export default SocketSource;
