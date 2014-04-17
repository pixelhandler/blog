/**
  @module app
  @submodule rethinkdb_adapter/createRecord
  @requires rethinkdb, inflect, debug
**/
var r = require('rethinkdb');
var inflect = require('inflect');
var loginfo = require('debug')('rdb:info');
var logerror = require('debug')('rdb:error');

/**
  Exports {Function} - change an adapter's prototype.createRecord method

  @param {Adapter} adapter
  @param {Function} connect - wrapper for the RethinkDB API `r.connect`
  @return {Function} adapter.createRecord
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;
  /**
    @method createRecord
    @param {String} type
    @param {Object} record
    @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  **/
  adapter.createRecord = function (type, record, callback) {
    var payload = transform(record);
    var db = _adapter.db;
    _connect(function (err, connection) {
      r.db(db).table(type).insert(payload, {returnVals: true})
        .run(connection, function (err, result) {
          if (err) {
            createError(err, connection, callback);
          } else {
            createSuccess(type, result, connection, callback);
          }
          connection.close();
        });
    });
  };
  return adapter.createRecord;
};

function createError(err, connection, callback) {
  var msg = "[ERROR][%s][create] %s:%s\n%s";
  logerror(msg, connection._id, err.name, err.msg, err.message);
  callback(err, null);
}

function createSuccess(type, result, connection, callback) {
  var json = result.new_val;
  var rootKey = inflect.pluralize(type);
  var payload = {};
  payload[rootKey] = [ transform(json) ];
  loginfo("Success create %s id: %s, connection id: %s", type, json.id, connection._id);
  callback(null, payload);
}

function transform(payload) {
  return transformDate(payload);
}

function transformDate(payload) {
  if (payload.date) {
    payload.date = new Date(payload.date);//.toISOString();
  }
  return payload;
}
