/**
  @module app
  @submodule routes/metrics
  @requires app, rethinkdb_adapter
**/
var loginfo = require('debug')('app:info');
var logerror = require('debug')('app:error');
var node_env = process.env.NODE_ENV || 'development';
var db = require('rethinkdb_adapter');


/**
  Exports {Function} routes for Metrics resource

  @main routes/metrics
  @param {Object} app - express application instance
**/
module.exports = function(app) {

  /**
    Create an metric resource

    Route: (verb) POST /metrics
    @async
  **/
  app.post('/metrics', function (req, res) {
    var metrics = req.body.metrics;
    metrics.remoteAddress = req.ip;
    metrics.userAgent = req.headers['user-agent'];
    if (!validPayload(metrics)) { res.send(422); }
    db.createRecord('metrics', metrics, function (err, payload) {
      if (err) {
        logerror(err);
        res.send(500);
      } else {
        res.status(201).send(payload);
      }
    });
  });

  var validPayload = function(payload) {
    var attrs = 'pathname date name startTime duration screen versions remoteAddress userAgent';
    attrs = attrs.split(' ');
    for (var prop in payload) {
      if (payload.hasOwnProperty(prop)) {
        if (attrs.indexOf(prop) === -1) {
          return false;
        }
      }
    }
    return true;
  };

  /**
    (Read) Find metrics accepts query object

    Route: (verb) GET /metrics
    @async
  **/
  app.get('/metrics', function (req, res) {
    var query = queryFactory(req.query);
    db.findQuery('metrics', query, function (err, payload) {
      if (err) {
        logerror(err);
        res.send(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });

};

/**
  @method queryFactory
  @param {Object} query
  @return {Object} query - with defaults and number strings converted
**/
function queryFactory(query) {
  query.limit = (query.limit) ? parseInt(query.limit, 10) : 200;
  query.offset = (query.offset)? parseInt(query.offset, 10) : 0;
  query.sortBy = query.sortBy || 'date';
  query.order = query.order || 'desc';
  return query;
}
