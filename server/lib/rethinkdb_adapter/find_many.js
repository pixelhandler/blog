/**
  @module app
  @submodule rethinkdb_adapter/findMany
  @requires rethinkdb, inflect, debug
**/
var r = require('rethinkdb');
var inflect = require('inflect');
var loginfo = require('debug')('rdb:info');
var logerror = require('debug')('rdb:error');

/**
  Exports {Function} - change an adapter's findMany method

  @param {Adapter} adapter
  @param {Function} connect - wrapper for the RethinkDB API `r.connect`
  @return {Function} adapter.find
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;
  /**
    @method findMany
    @param {String} type - name of resource
    @param {Array} ids
    @param {Function} callback(err, results) - Callback args: Error, Results Array
  **/
  adapter.findMany = function (type, ids, callback) {
    var db = _adapter.db;
    _connect(function (err, connection) {
      var table = r.db(db).table(type);
      table.getAll.apply(table, ids)
        .run(connection, function (err, record) {
          if (err) {
            findError(err, connection, callback);
          } else {
            findSuccess(type, record, connection, callback);
          }
        });
    });
  };
  return adapter.findMany;
};

/**
  Async success / error handlers
**/
function findError(err, connection, callback) {
  logerror("[ERROR][%s][find] %s:%s\n%s", connection._id, err.name, err.msg, err.message);
  callback(err, null);
  connection.close();
}

function findSuccess(type, json, connection, callback) {
  json = transform(json);
  var payload = {};
  var rootKey = inflect.pluralize(type);
  payload[rootKey] = json;
  if (json && json.id) {
    loginfo("Success find %s id: %s, connection id: %s", type, json.id, connection._id);
  }
  callback(null, payload);
  connection.close();
}

function transform(payload) {
  return transformDate(payload);
}

function transformDate(payload) {
  if (!payload || !payload.date) return payload;
  if (payload.date) {
    payload.date = payload.date.toISOString();
  }
  return payload;
}
