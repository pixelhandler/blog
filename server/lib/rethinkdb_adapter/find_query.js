/**
  @module app
  @submodule rethinkdb_adapter/findQuery
  @requires rethinkdb, inflect, debug
**/
var r = require('rethinkdb');
var inflect = require('inflect');
var loginfo = require('debug')('rdb:info');
var logerror = require('debug')('rdb:error');

/**
  Exports {Function} change an adapter's prototype.findQuery method

  @param {Adapter} adapter
  @param {Function} connect - wrapper for the RethinkDB API `r.connect`
  @return {Function} adapter.findQuery
**/
module.exports = function(adapter, connect) {
  var _adapter = adapter;
  var _connect = connect;
  /**
    @method findQuery
    @param {String} type - name of resource
    @param {Object} query - key/value pairs
    @param {Function} callback that accepts arguments: {Error} err, {Array} results 
    @async
  **/
  adapter.findQuery = function (type, query, callback) {
    var metaPartial = metaFactory(query);
    var db = _adapter.db;
    _connect(function (err, connection) {
      if (err) logerror(err);
      var collection = r.db(db).table(type);
      collection.count().run(connection, function (err, results) {
        if (err) logerror(err);
        var meta = metaPartial(results);
        var criteria = collection.orderBy(r[meta.order](meta.sortBy)).skip(meta.offset).limit(meta.limit);
        if (query.withFields) {
          criteria = criteria.withFields.apply(criteria, query.withFields);
        }
        criteria.run(connection, function (err, cursor) {
          if (err) {
            findError(err, connection, callback);
          } else {
            findQuerySuccess(type, cursor, meta, connection, callback);
          }
          connection.close();
        });
      });
    });
  };
  return adapter.findQuery;
};

/**
  Meta factory - create {Object) `meta` data, returned w/ find responses 
  partial application, returns `meta` function which needs the count
  @method buildMeta
  @param {Object} query
  @return {Function} meta that accepts param for total (count of query result)
**/
function metaFactory(query) {
  var _query = queryFactory(query);
  /**
    @method meta
    @param {Number} total
    @return {object} - with properties: `limit`, `sort`, `sortBy`, `order`, `total`
  **/
  var meta = function (total) {
    _query.total = total;
    return _query;
  };
  return meta;
}

/**
  @method queryFactory
  @param {Object} query
  @return {Object} query - with defaults and number strings converted
**/
function queryFactory(query) {
  query.limit = (query.limit)? parseInt(query.limit, 10) : 10;
  query.offset = (query.offset)? parseInt(query.offset, 10) : 0;
  query.sortBy = query.sortBy || 'date';
  query.order = query.order || 'desc';
  return query;
}

/* TODO confirm date sorting, dates cast to strings?
var isSortByDate = (payload.meta.sortBy === 'date');
var isDescOrder = (payload.meta.order === 'desc');
if (isSortByDate) {
  payload.posts.sort(function (a, b) {
    var order = 0; 
    if (isDescOrder) {
      order = (b > a) ? 1 : -1; 
    } else {
      order = (b > a) ? 1 : -1; 
    }
    return order;
  });
}
*/

/**
  Async success / error handlers
**/
function findError(err, callback) {
  var msg = "[ERROR][%s][find] %s:%s\n%s";
  logerror(msg, connection._id, err.name, err.msg, err.message);
  callback(err, null);
}

function findQuerySuccess(type, cursor, meta, connection, callback) {
  cursor.toArray(function(err, results) {
    results = transform(results);
    var msg;
    if (err) {
      msg = "[ERROR][%s][find][toArray] %s:%s\n%s";
      logerror(msg, connection._id, err.name, err.msg, err.message);
      callback(err, null);
    } else {
      var rootKey = inflect.pluralize(type);
      var payload = { meta: meta };
      payload[rootKey] = results;
      msg = "Success findQuery %s, connection id: %s";
      loginfo(msg, type, connection._id);
      callback(null, payload);
    }
  });
}

function transform(results) {
  var payload = [];
  for (var i = 0; i < results.length; i++) {
    payload.push(transformDate(results[i]));
  }
  return payload;
}

function transformDate(payload) {
  if (payload.date) {
    if (typeof payload.date.toISOString == 'function') {
      payload.date = payload.date.toISOString();
    }
  }
  return payload;
}
