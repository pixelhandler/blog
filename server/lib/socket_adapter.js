/**
  @module app
  @submodule socket_adapter

  db adapter using Socket.io
  - listens & replies to messages: find, findQuery, isLoggedIn, login, logout, patch
  - emits messages: didPatch
**/

var db = require('rethinkdb_adapter');
var loginfo = require('debug')('socket:info');
var logerror = require('debug')('socket:error');

/**
  Exports setup function

  @param {Object} express server
  @param {Function} sessionMiddleware for session handling
  @param {Object} config i.e. `{admin: {username: 'admin', password: 'admin'}}`
  @return {Object} `io` socket.io instance
**/
module.exports = function(server, sessionMiddleware, config) {

  // options: https://github.com/Automattic/engine.io#methods-1
  var options = {
    'transports': ['websocket', 'polling'],
    'cookie': 'connect.sid'
  };

  var io = require('socket.io')(server, options);

  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on('connection', function (socket) {
    // Simple sanity check for client to confirm socket is working
    socket.emit('hello', { hello: 'world' });
    socket.on('talk-to-me', function (data, cb) {
      cb(data);
    });

    socket.on('isLoggedIn', function (callback) {
      var user = (socket.request.session) ? socket.request.session.user : null;
      if (!!user) { loginfo('isLogggedIn', user); }
      callback(!!user);
    });

    socket.on('login', function (credentials, callback) {
      credentials = JSON.parse(credentials);
      if (!credentials) {
        return callback(false);
      }
      var uname = credentials.username;
      var pword = credentials.password;
      var session = socket.request.session;
      if (session && uname === config.admin.username && pword === config.admin.password) {
        session.user = uname;
        loginfo('login: %s', session.user);
        session.save();
        callback(true);
      }
    });

    socket.on('logout', function (callback) {
      socket.request.session = null;
      callback(true);
    });

    socket.on('findQuery', findQuery);

    socket.on('find', find);

    socket.on('patch', function (operation, callback) {
      var user = (socket.request.session) ? socket.request.session.user : null;
      if (!user) {
        logerror('patch tried without user session');
        return callback(JSON.stringify({errors: ["Login Required"]}));
      }
      var _callback = function (error, payload) {
        if (error) {
          logerror('Patch Error!', error);
          callback({errors: error});
        } else {
          payload = payload || JSON.stringify({code: 204});
          callback(payload);
          loginfo('didPatch...', operation, payload);
          socket.broadcast.emit('didPatch', operation);
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
  loginfo('findQuery...', query);
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }
  var resource = query.resource;
  delete query.resource;
  var _cb = callback;
  db.findQuery(resource, query, function (err, payload) {
    if (err) {
      logerror(err);
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
  loginfo('find...', query);
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
      _cb(errorPayload);
    } else {
      if (payload[resource] !== null) {
        _cb(payload);
      } else {
        db.findBySlug(resource, id, function (err, payload) {
          if (err) {
            _cb(errorPayload);
          } else {
            if (payload[resource] !== null) {
              _cb(payload);
            } else {
              _cb({ errors: { code: 404, error: 'Not Found' } });
            }
          }
        });
      }
    }
  });
}

function patch(operation, callback) {
  loginfo('patch...', operation);
  if (typeof operation === 'string') {
    operation = JSON.parse(operation);
  }
  var path = operation.path.split('/');
  var type = path[1];
  var id = path[2];
  var prop = path[3]; // REVIEW support sub-path?
  if (prop === 'links') {
    var link = path[4];
    patchLinks(type, id, link, operation, callback);
  } else if (operation.op === 'replace') {
    var payload = {};
    payload[prop] = operation.value;
    db.updateRecord(type, id, payload, callback);
  } else if (operation.op === 'remove') {
    db.deleteRecord(type, id, callback);
  } else if (operation.op === 'add') {
    db.createRecord(type, operation.value, callback);
  }
}

function patchLinks(type, id, linkName, operation, callback) {
  loginfo('patchLinks...', type, id, linkName, operation);
  find({resource: type, id: id}, function (record) {
    if (!record || record && record.errors) {
      var errors = (record) ? record.errors : [];
      logerror('Error finding resource for patchLinks action', errors);
      callback(errors);
    } else {
      var path = operation.path.split(linkName);
      path = (path) ? path[1] : null;
      var value = operation.value;
      var op = operation.op;
      var payload = record[type];
      payload.links = payload.links || {};
      payload.links[linkName] = payload.links[linkName] || [];
      if (op === 'add' && path.match(/\-$/) !== null && value) {
        payload.links[linkName].push(value);
      } else if (value && op === 'add' || op === 'replace') {
        payload.links[linkName] = value;
      } else if (op === 'remove') {
        var linkId = path.split('/');
        if (linkId.length > 1) {
          linkId = linkId[1];
          var idx = payload.links[linkName].indexOf(linkId);
          payload.links[linkName].splice(idx, 1);
        } else {
          payload.links[linkName] = null;
        }
      }
      db.updateRecord(type, id, {links: payload.links}, callback);
    }
  });
}

// TODO Use Ember.Inflector or other Inflector?
function singularize(name) {
  return name.slice(0, name.length - 1);
}

function pluralize(name) {
  return name + 's';
}
