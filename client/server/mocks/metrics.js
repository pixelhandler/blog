module.exports = function(app) {
  var express = require('express');
  var metricsRouter = express.Router();

  var resource = 'metrics';
  var dbSetupConfig = {};
  dbSetupConfig[resource] = 'id';

  var db = require('rethinkdb_adapter');
  db.setup('http_mock_db', dbSetupConfig);

  metricsRouter.get('/', function(req, res) {
    db.findQuery(resource, req.query, function (err, payload) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.send(payload);
      }
    });
  });

  metricsRouter.post('/', function(req, res) {
    var metrics = req.body[resource];
    metrics.remoteAddress = req.connection.remoteAddress;
    db.createRecord(resource, metrics, function (err, payload) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.status(201).send(payload);
      }
    });
  });

  metricsRouter.get('/:id', function(req, res) {
    var ids = req.params.id.split(',');
    if (ids.length === 1) {
      db.find(resource, ids[0], function (err, payload) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          if (payload[resource] !== null) {
            res.send(payload);
          } else {
            db.findBySlug(resource, ids[0], function (err, payload) {
              if (err) {
                console.error(err);
                res.sendStatus(500);
              } else {
                if (payload[resource] !== null && payload[resource] !== void 0) {
                  res.send(payload);
                } else {
                  res.status(404).end();
                }
              }
            });
          }
        }
      });
    } else if (ids.length > 1) {
      db.findMany(resource, ids, function (err, payload) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          res.send(payload);
        }
      });
    }
  });

  metricsRouter.put('/:id', function(req, res) {
    db.updateRecord(resource, req.params.id, req.body[resource], function (err, payload) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(204); // No Content
      }
    });
  });

  metricsRouter.delete('/:id', function(req, res) {
    db.deleteRecord(resource, req.params.id, function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(204); // No Content
      }
    });
  });

  app.use('/api/metrics', metricsRouter);
};
