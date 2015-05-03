module.exports = function(app) {
  var express = require('express');
  var metricsRouter = express.Router();

  var resource = 'metrics';
  var dbSetupConfig = {};
  dbSetupConfig[resource] = 'id';

  //var db = require('rethinkdb_adapter');
  //db.setup('http_mock_db', dbSetupConfig);

  /**
    Create an metric resource

    Route: (verb) POST /metrics
    @async
  **/
  metricsRouter.post('/', function(req, res) {
    var metrics = req.body.metrics;
    metrics.remoteAddress = req.ip || req.connection.remoteAddress;
    metrics.userAgent = req.headers['user-agent'];
    if (!validPayload(metrics)) { res.send(422); }
    db.createRecord(resource, metrics, function (err, payload) {
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
  metricsRouter.get('/', function(req, res) {
    var query = queryFactory(req.query);
    db.findQuery(resource, query, function (err, payload) {
      if (err) {
        logerror(err);
        res.send(500);
      } else {
        res.send(payload);
      }
    });
  });

  /**
    @method queryFactory
    @param {Object} query
    @return {Object} query - with defaults and number strings converted
  **/
  var queryFactory = function(query) {
    query.limit = (query.limit) ? parseInt(query.limit, 10) : 200;
    query.offset = (query.offset)? parseInt(query.offset, 10) : 0;
    query.sortBy = query.sortBy || 'date';
    query.order = query.order || 'desc';
    return query;
  };

  app.use('/api/metrics', metricsRouter);
};
