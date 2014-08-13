/**
  Rethinkdb Adapter methods:
  - `findQuery`, `find`, `createRecord`, `updateRecord`

  @module app
  @submodule rethinkdb_adapter
  @requires rethinkdb, adapter, assert, inflect,
    rethinkdb_adapter/setup, rethinkdb_adapter/find, rethinkdb_adapter/findQuery,
    rethinkdb_adapter/createRecord, rethinkdb_adapter/updateRecord
**/
var r = require('rethinkdb');
var db = require('./adapter');
var assert = require('assert');

/**
  RethinkDB database settings.
  Defaults can be overridden using environment variables.
  @method find
**/
var adapter = new db.Adapter({
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db: process.env.RDB_DB
});

/**
  Export {Function} setup
  @method setup
**/
module.exports.setup = require(path('setup'))(adapter, onConnect);

/**
  Export {Function} find
  @method find
**/
module.exports.find = require(path('find'))(adapter, onConnect);

/**
  Export {Function} findMany
  @method findMany
**/
module.exports.findMany = require(path('find_many'))(adapter, onConnect);

/**
  Export {Function} findBySlug
  @method findBySlug
**/
module.exports.findBySlug = require(path('find_by_slug'))(adapter, onConnect);

/**
  Export {Function} findQuery
  @method findQuery
**/
module.exports.findQuery = require(path('find_query'))(adapter, onConnect);

/**
  Export {Function} createRecord
  @method createRecord
**/
module.exports.createRecord = require(path('create_record'))(adapter, onConnect);

/**
  Export {Function} updateRecord
  @method updateRecord
**/
module.exports.updateRecord = require(path('update_record'))(adapter, onConnect);

/**
  Export {Function} updateRecordBySlug
  @method updateRecordBySlug
**/
module.exports.updateRecordBySlug = require(path('update_record_by_slug'))(adapter, onConnect);

/**
  Export {Function} patchRecord
  @method patchRecord
**/
module.exports.patchRecord = require(path('patch_record'))(adapter, onConnect);

/**
  Export {Function} deleteRecord
  @method deleteRecord
**/
module.exports.deleteRecord = require(path('delete_record'))(adapter, onConnect);

/**
  Export {Function} deleteRecordBySlug
  @method deleteRecordBySlug
**/
module.exports.deleteRecordBySlug = require(path('delete_record_by_slug'))(adapter, onConnect);

/**
  @method path
  @param {string} name - name of submodule to load
**/
function path (name) {
  return './rethinkdb_adapter/' + name;
}

/**
  Connection management

  A wrapper function for the RethinkDB API `r.connect`
  to keep the configuration details in a single function
  and fail fast in case of a connection error.

  Use a new connection for each query needed to serve a user request.
  In case generating the response would require multiple queries,
  the same connection should be used for all queries. Example:

  ```javascript
  onConnect(function (err, connection) {
    if (err) { return callback(err); }
    query1.run(connection, callback);
    query2.run(connection, callback);
  });
  ```
  @method onConnect
  @param {Function} callback
**/
function onConnect(callback) {
  var settings = { host: adapter.host, port: adapter.port };
  var _assert = assert;
  r.connect(settings, function (err, connection) {
    _assert.ok(err === null, err);
    connection._id = Math.floor(Math.random() * 10001);
    callback(err, connection);
  });
}
