import Ember from 'ember';
import Orbit from 'orbit';
import OC from 'orbit-common';
import SocketService from '../services/socket';
import JSONAPISource from 'orbit-common/jsonapi-source';

Orbit.Promise = Orbit.Promise || Ember.RSVP.Promise;

var SocketSource = JSONAPISource.extend({

  init: function (options) {
    Orbit.assert('SocketSource requires SocketService be defined', SocketService);
    Orbit.assert('SocketSource requires Orbit.Promise be defined', Orbit.Promise);
    Orbit.assert('SocketSource only supports usePatch option', this.usePatch);
    this._socket = SocketService.create();

    // See JSONAPISource
    this.SerializerClass  = options.SerializerClass || this.SerializerClass;
    if (this.SerializerClass && this.SerializerClass.wrappedFunction) {
      this.SerializerClass = this.SerializerClass.wrappedFunction;
    }
    // not calling super, instead calling template/abstract prototype init method
    return OC.Source.prototype.init.apply(this, arguments);
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
    console.log('type', type, 'query', query);
    var root = pluralize(type);
    return new Orbit.Promise(
      function (resolve, reject) {
        try {
          this._socket.emit(channel, JSON.stringify(query), function (raw) {
            if (raw.errors || !raw[root]) {
              reject(raw.errors);
            } else {
              resolve(raw);
            }
          });
        } catch (e) {
          var msg = 'SocketSource#_remoteFind channel:' + channel + ' Error';
          console.error(msg, e);
          reject(msg);
        }
      }.bind(this)
    ).then(
      function (raw) {
        var data = this.deserialize(type, raw);
        return this.settleTransforms().then(function() {
          return data;
        });
      }.bind(this)
    );
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

  _transformUpdateAttribute: function (operation) {
    return this._transformReplace(operation); // includes attr in path
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

  _transformAddLink: function () {
    throw new Error('SocketSource#_transformAddLink not supported');
  },

  _transformRemoveLink: function () {
    throw new Error('SocketSource#_transformRemoveLink not supported');
  },

  _transformReplaceLink: function () {
    throw new Error('SocketSource#_transformReplaceLink not supported');
  },

  _remotePatch: function (type, id, remoteOp) {
    console.log('remoteOp', remoteOp);
    return new Orbit.Promise(function (resolve, reject) {
      try {
        this._socket.emit('patch', JSON.stringify(remoteOp), resolve);
      } catch (e) {
        var msg = 'SocketSource#_remotePatch op:' + remoteOp.op + ' Error';
        console.error(msg, e);
        reject(msg);
      }
    }.bind(this)).then(function (raw) {
      if (raw && Array.isArray(raw)) {
        this.deserialize(type, id, raw[0]);
      } else {
        this._transformCache(remoteOp);
      }
    }.bind(this));
  }

});

// TODO use Ember.Inflector https://github.com/stefanpenner/ember-inflector.git
var pluralize = function (name) {
  return name + 's';
};

export default SocketSource;
