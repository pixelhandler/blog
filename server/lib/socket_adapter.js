/**
  @module app
  @submodule socket_adapter

  db adapter using Socket.io
**/

var db = require('./rethinkdb_adapter');
var debug = require('debug')('socket_adapter');


/**
  Exports setup function

  @param {Object} express server
  @return {Object} `io` socket.io instance
**/
module.exports = function(server) {

  // options: https://github.com/Automattic/engine.io#methods-1
  var options = {
    'transports': ['websocket', 'polling'],
    'cookie': 'connect.sid'
  };

  var io = require('socket.io')(server, options);

  io.on('connection', function (socket) {
    // Simple sanity check for client to confirm socket is working
    socket.emit('hello', { hello: 'world' });
    socket.on('talk-to-me', function (data, cb) {
      console.log(data);
      cb(data);
    });

    socket.on('findQuery', findQuery);

    socket.on('find', find);

    socket.on('add', function (payload, callback) {
      var _callback = function (_payload) {
        callback(_payload);
        io.emit('didAdd', _payload);
      };
      createRecord(payload, _callback);
    });

    socket.on('patch', function (operation, callback) {
      var _callback = function (error, _payload) {
        if (error) {
          console.log('Patch Error!', error);
          callback({errors: error});
        } else {
          console.log('didPatch...', _payload);
          callback(_payload);
          io.emit('didPatch', _payload);
        }
      };
      patch(operation, _callback);
    });

    socket.on('disconnect', function () {
      io.emit('error', 'User disconnected');
    });
  });

  return io;
};

/**
  findQuery - uses query to find resources

  @param {String} JSON strigified query object `resource` property is required
  @param {Function} callback
  @private
**/
function findQuery(query, callback) {
  console.log('findQuery...', query);
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }
  var resource = query.resource;
  delete query.resource;
  var _cb = callback;
  db.findQuery(resource, query, function (err, payload) {
    if (err) {
      console.error(err);
      payload = { errors: { code: 500, error: 'Server failure' } };
    }
    _cb(payload);
  });
}

/**
  find - uses query to find resources by id or slug

  @param {String} JSON strigified query object requires `resource`, `id` properties
  @param {Function} callback
  @private
**/
function find(query, callback) {
  console.log('find...', query);
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }
  var resource = query.resource;
  delete query.resource;
  var id = query.id;
  delete query.id;
  var _cb = callback;
  var errorPayload = { errors: { code: 500, error: 'Server failure' } };
  db.find(resource, id, function (err, payload) {
    if (err) {
      debug(err);
      _cb(errorPayload);
    } else {
      if (payload.posts !== null) {
        debug('/posts/:id result not null', payload.posts);
        _cb(payload);
      } else {
        debug('/posts/:id result null, finding by slug');
        db.findBySlug('posts', id, function (err, payload) {
          if (err) {
            debug(err);
            _cb(errorPayload);
          } else {
            if (payload.posts !== null) {
              debug('/posts/:slug result not null', payload.posts);
              _cb(payload);
            } else {
              debug('/posts/:slug result not found');
              _cb({ errors: { code: 404, error: 'Not Found' } });
            }
          }
        });
      }
    }
  });
}

function createRecord(payload, callback) {
  console.log('createRecord...', payload);
  if (typeof payload === 'string') {
    payload = JSON.parse(payload);
  }
  var typeKey = pluralize(payload.type);
  delete payload.type;
  var _cb = callback;
  db.createRecord(typeKey, payload[typeKey], function (err, payload) {
    if (err) {
      console.error(err);
      payload = { errors: { code: 500, error: 'Server failure' } };
    }
    _cb(payload);
  });
}

function patch(operation, callback) {
  console.log('patch...', operation);
  if (typeof operation === 'string') {
    operation = JSON.parse(operation);
  }
  var path = operation.path.split('/');
  var type = pluralize(path[1]);
  var id = path[2];
  var prop = path[3]; // TODO support sub-path
  var payload = {};
  if (operation.op === 'replace') {
    payload[prop] = operation.value;
    db.updateRecord(type, id, payload, callback);
  } else if (operation.op === 'remove') {
    db.deleteRecord(type, id, callback);
  }
}

// TODO Use Ember.Inflector or other Inflector?
function singularize(name) {
  return name.slice(0, name.length - 1);
}

function pluralize(name) {
  return name + 's';
}
