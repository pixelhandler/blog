/**
  @module app
  @submodule rethinkdb_adapter/setup
  @requires rethinkdb, assert, debug
**/
var r = require('rethinkdb');
var assert = require('assert');
var loginfo = require('debug')('rdb:info');
var logerror = require('debug')('rdb:error');

/**
  Exports {Function} - setup an adapter with db connection wrapper

  partial application using adapter
  @param {Adapter} adapter
  @param {Function} connect
  @return {Function} setup - accepts params: `db`, `tables`
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;

  /**
    Connect to RethinkDB instance and perform a basic database setup:
    - create the `RDB_DB` database (defaults to `blog`)
    - create tables `catalogs`, `posts` in this database

    @method setup
    @main rethinkdb_adapter/setup
    @param {String} db (optional) - database name
    @param {Object} tables (optional) - table names as properties
      with primary key assigned to name
  **/
  return function setup(db, tables) {
    _adapter.db = db || _adapter.db;
    _adapter.tables = tables || _adapter.tables;
    _connect(connectCallback);
  };

  /**
    Connect callback
    @method connectCallback
    @param {Error} err - Error
    @param {Object} connection - db active connection
  **/
  function connectCallback(err, connection) {
    assert.ok(err === null, err);
    var db = _adapter.db;
    r.dbCreate(db).run(connection, function dbCreateCallback(err, result) {
      if (err) {
        createDbError(err);
      } else {
        createDbSuccess();
      }
      for (var tableName in adapter.tables) {
        createDbTable(connection, tableName);
      }
    });
  }

  /**
    Create Db Table

    @method createDbTable
    @param {Object} connection - db active connection
    @param {String} tableName
  **/
  function createDbTable(connection, tableName) {
    var settings = { primaryKey: adapter.tables[tableName] };
    var db = _adapter.db;

    r.db(db).tableCreate(tableName, settings).run(connection, createDbTableCallback);
  }

  function createDbTableCallback(err, result) {
    if (err) {
      createTableError(err);
    } else {
      createTableSuccess(tableName);
    }
  }

  /**
    Logging Callbacks
  **/
  function createDbError(err) {
    var msg = "[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s";
    logerror(msg, _adapter.db, err.name, err.msg, err.message);
  }

  function createDbSuccess() {
    var msg = "[INFO] RethinkDB database '%s' created";
    loginfo(msg, _adapter.db);
  }

  function createTableError(err, tableName) {
    var msg = "[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s";
    logerror(msg, tableName, err.name, err.msg, err.message);
  }

  function createTableSuccess(tableName) {
    var msg = "[INFO] RethinkDB table '%s' created";
    loginfo(msg, tableName);
  }
};
