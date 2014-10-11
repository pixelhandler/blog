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
  Exports {Function} - changes an adapter's prototype.patchRecord method

  @param {Adapter} adapter
  @param {Function} connect - wrapper for the RethinkDB API `r.connect`
  @return {Function} adapter.updateRecord
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;

  /**
    @method patchRecord
    @param {String} type
    @param {String) id
    @param {Object} patchPayload (JSONPatch format, rfc6902)
    @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  **/
  adapter.patchRecord = function (type, id, patchPayload, callback) {
    loginfo('patchPayload');
    type = type || extractType(patchPayload);
    id = id || extractId(patchPayload);
    var payload = extractPayload(patchPayload);
    var db = _adapter.db;
    _connect(function (err, connection) {
      r.db(db)
        .table(type)
        .get(id)
        .update(payload, {return_vals: false})
        .run(connection, function (err, result) {
          if (err) {
            patchError(err, connection, callback);
          } else {
            patchSuccess(type, result, connection, callback);
          }
          connection.close();
        });
    });
  };
  return adapter.patchRecord;
};

function patchError(err, connection, callback) {
  var msg = "[ERROR][%s][update] %s:%s\n%s";
  logerror(msg, connection._id, err.name, err.msg, err.message);
  callback(err, null);
}

function patchSuccess(type, result, connection, callback) {
  var json = result.new_val;
  var rootKey = inflect.pluralize(type);
  var payload = {};
  //payload[rootKey] = transform(json);
  var msg = "Success update %s: %s, connection: %s";
  loginfo(msg, type/*, json.id*/, connection._id);
  callback(null, '');
}

/**
  Example patch payload:
  ```
  {
    "op": "replace",
    "path": "/posts/327fc99b-f471-497c-9bfd-50c43110d309/title",
    "value": "Refreshed my Blog with Express and Ember.js"
  }
  ```
*/

function extractType(patchPayload) {
  var type = patchPayload.path.split('/')[1];
  return type;
}

function extractId(patchPayload) {
  var id = patchPayload.path.split('/')[2];
  return id;
}

function extractPayload(patchPayload) {
  var attrPath = patchPayload.path.split('/').slice(3);
  var payload = {};
  payload[attrPath[0]] = patchPayload.value;
  return payload;
}
