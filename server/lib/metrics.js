/**
  @module lib/metrics
  @requires rethinkdb
**/
var r = require('rethinkdb');
var assert = require('assert');
var loginfo = require('debug')('app:info');
var logerror = require('debug')('app:error');

/**
  Impressions Query - accepts params:
  ```
  {
    seconds: 86400,
    sortBy: "pathname",
    limit: 1000,
    offset: 0,
    order: "desc"
  }
  ```
  @method impressions
  @param {Object} query
  @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  @async
**/
module.exports.impressions = function (query, callback) {
  query.seconds = parseInt(query.seconds, 10) || 86400;
  var host = process.env.RDB_HOST || 'localhost';
  var port = parseInt(process.env.RDB_PORT) || 28015;
  var db = process.env.RDB_DB || 'blog';

  r.connect({ host: host, port: port }, function (err, connection) {
    assert.ok(err === null, err);
    //connection._id = Math.floor(Math.random() * 10001);
    //loginfo('connection._id', connection._id);
    r.db(db).table('metrics')
    .filter(function(post) {
      return r.ISO8601(post('date')).during(
        r.epochTime( r.now().toEpochTime().sub(query.seconds) ),
        r.now()
      );
    })
    .filter('page_view')
    .withFields('pathname')
    .group('pathname')
    .count()
    .ungroup()
    .map(function (doc) {
      return doc.merge({
        pathname: doc('group').split('/').slice(1),
        impressions: doc('reduction')
      }).without('group','reduction');
    })
    .run(connection, function (err, payload) {
      if (err) {
        logerror('impressions', err);
      }
      callback(err, payload);
    });

  });
};
