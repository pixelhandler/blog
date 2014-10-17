/**
  @module app
  @submodule rethinkdb_adapter/updateRecord
  @requires rethinkdb, inflect, debug
**/
var r = require('rethinkdb');
var inflect = require('inflect');
var loginfo = require('debug')('rdb:info');
var logerror = require('debug')('rdb:error');

/**
  Exports {Function} - changes an adapter's prototype.updateRecord method

  @param {Adapter} adapter
  @param {Function} connect - wrapper for the RethinkDB API `r.connect`
  @return {Function} adapter.updateRecord
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;

  /**
    @method updateRecord
    @param {String} type
    @param {String) id
    @param {Object} record
    @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  **/
  adapter.updateRecord = function (type, id, record, callback) {
    var payload = transform(record);
    var db = _adapter.db;
    _connect(function (err, connection) {
      r.db(db).table(type).filter(function(post) {
        return post('id').eq(id).or( post('slug').eq(id) );
      }).update(payload, {return_changes: true}).run(connection, function (err, result) {
        if (err) {
          updateError(err, connection, callback);
        } else {
          updateSuccess(type, result, connection, callback);
        }
        connection.close();
      });
    });
  };
  return adapter.updateRecord;
};

function updateError(err, connection, callback) {
  var msg = "[ERROR][%s][update] %s:%s\n%s";
  logerror(msg, connection._id, err.name, err.msg, err.message);
  callback(err, null);
}

function updateSuccess(type, result, connection, callback) {
  var json = (result) ? result.changes[0].new_val : void 0;
  var payload;
  if (json) {
    payload = {};
    var rootKey = inflect.pluralize(type);
    payload[rootKey] = transform(json);
  }
  loginfo("Success update %s %s", type, (json) ? ", id: " + json.id : '');
  callback(null, payload);
}

function transform(payload) {
  return transformDate(payload);
}

function transformDate(payload) {
  if (payload.date) {
    if (typeof payload.date.toISOString == 'function') {
      payload.date = payload.date.toISOString();
    }
  }
  return payload;
}
