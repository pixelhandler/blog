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
    @param {Array:Objects} operations (JSONPatch format, rfc6902), only supports a single op
    @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  **/
  adapter.patchRecord = function (type, id, operations, callback) {
    type = type || extractType(operations);
    id = id || extractId(operations);
    // TODO multiple operations? Preflight with test operation?
    var operation = operations[0];
    if (operation.op === 'replace') {
      operations[0] = extractReplacePayload(operations[0]);
      connectAndUpdate(type, id, operations[0], callback);
    } else if (operation.op === 'remove' && operation.path === '/') {
      connectAndRemove(type, id, callback);
    }
  };

  var connectAndUpdate = function (type, id, payload, callback) {
    _connect(function (err, connection) {
      updateRecord(type, id, payload, connection, callback);
    });
  };

  var updateRecord = function (type, id, payload, connection, callback) {
    r.db(_adapter.db)
      .table(type)
      .get(id)
      .update(payload/*, {return_vals: false}*/)
      .run(connection, function (err, result) {
        if (err) {
          patchError(err, connection, callback);
        } else {
          patchSuccess(type, result, connection, callback);
        }
        connection.close();
      });
  };

  var connectAndRemove = function (type, id, callback) {
    _connect(function (err, connection) {
      removeRecord(type, id, connection, callback);
    });
  };

  var removeRecord = function (type, id, connection, callback) {
    r.db(_adapter.db).table(type).get(id).delete()
      .run(connection, function (err, result) {
        if (err) {
          patchError(err, connection, callback);
        } else {
          patchSuccess(type, result, connection, callback);
        }
        connection.close();
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
  var payload;
  if (result) {
    payload = {};
    var json = result.new_val;
    var rootKey = inflect.pluralize(type);
    //payload[rootKey] = transform(json);
  }
  loginfo("Success update %s", type);
  callback(null, payload || '');
}

/**
  Example patch payload:
  ```
  [{
    "op": "replace",
    "path": "/posts/327fc99b-f471-497c-9bfd-50c43110d309/title",
    "value": "Refreshed my Blog with Express and Ember.js"
  }]
  ```
*/

function extractType(patchPayload) {
  var type = patchPayload[0].path.split('/')[1];
  return type;
}

function extractId(patchPayload) {
  var id = patchPayload[0].path.split('/')[2];
  return id;
}

function extractReplacePayload(operation) {
  var payload = {};
  // TODO support nested patch?
  var attr = operation.path.split('/').slice(1)[0];
  payload[attr] = operation.value;
  return payload;
}
