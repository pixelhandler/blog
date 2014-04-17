/**
  @module app
  @submodule socket_adapter

  db adapter using Socket.io
**/

var db = require('./rethinkdb_adapter');


/**
  Exports setup function

  @param {Object} express server
  @return {Object} `io` socket.io instance
**/
module.exports = function(server) {

  var io = require('socket.io').listen(server);

  io.configure('development', function(){
    io.set('transports', ['websocket']);
    io.set('log level', 0);
  });

  io.sockets.on('connection', function (socket) {
    // socket.emit('hello', { hello: 'world' });
    // socket.on('talk-to-me', function (data, cb) {
    //   console.log(data);
    //   cb(data);
    // });

    socket.on('findQuery', findQuery);

    socket.on('find', findById);

    socket.on('add', function () {
      io.sockets.emit('error', 'Add not implemented.');
    });

    socket.on('update', function () {
      io.sockets.emit('error', 'Update not implemented.');
    });

    socket.on('patch', function () {
      io.sockets.emit('error', 'Patch not implemented.');
    });

    socket.on('remove', function () {
      io.sockets.emit('error', 'Remove not implemented.');
    });

    socket.on('disconnect', function () {
      io.sockets.emit('error', 'User disconnected');
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
  _cb = callback;
  db.findQuery(resource, query, function (err, payload) {
    if (err) {
      console.log(payload);
      console.error(err);
      payload = { errors: { code: 500, error: 'Server failure' } };
    }
    _cb(payload);
  });
}

/**
  findById - uses query to find resources

  @param {String} JSON strigified query object requires `resource`, `id` properties
  @param {Function} callback
  @private
**/
function findById(query, callback) {
  console.log('find...', query);
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }
  var resource = query.resource;
  delete query.resource;
  var id = query.id;
  delete query.id;
  _cb = callback;
  db.find(resource, id, function (err, payload) {
    if (err) {
      console.log(payload);
      console.error(err);
      payload = { errors: { code: 500, error: 'Server failure' } };
    }
    _cb(payload);
  });
}
