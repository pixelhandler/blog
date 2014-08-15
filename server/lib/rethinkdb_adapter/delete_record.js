/**
  @module app
  @submodule rethinkdb_adapter/deleteRecord
  @requires rethinkdb, inflect, debug
**/
var r = require('rethinkdb');
var inflect = require('inflect');
var loginfo = require('debug')('rdb:info');
var logerror = require('debug')('rdb:error');

/**
  Exports {Function} - change an adapter's prototype.deleteRecord method

  @param {Adapter} adapter
  @param {Function} connect - wrapper for the RethinkDB API `r.connect`
  @return {Function} adapter.deleteRecord
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;
  /**
    @method deleteRecord
    @param {String} type
    @param {String} id
    @param {Function} callback(err, result)
  **/
  adapter.deleteRecord = function (type, id, callback) {
    var db = _adapter.db;
    _connect(function (err, connection) {
      r.db(db).table(type).get(id).delete()
        .run(connection, function (err, result) {
          if (err) {
            deleteError(err, connection, callback);
          } else {
            deleteSuccess(type, id, connection, callback);
          }
          connection.close();
        });
    });
  };

  return adapter.deleteRecord;
};

function deleteError(err, connection, callback) {
  var msg = "[ERROR][%s][delete] %s:%s\n%s";
  logerror(msg, connection._id, err.name, err.msg, err.message);
  callback(err, null);
}

function deleteSuccess(type, id, connection, callback) {
  var msg = "[Success][%s][delete] connection id:%s";
  loginfo(msg, type, connection._id);
  var payload = (id) ? { "op": "remove", "path": ["", type, id].join('/') } : null;
  callback(null, payload);
}
