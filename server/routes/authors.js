/**
  @module app
  @submodule routes/authors
  @requires app, rethinkdb_adapter
**/
var debug = require('debug')('authors');
var node_env = process.env.NODE_ENV || 'development';
var db = require('../lib/rethinkdb_adapter');


/**
  Exports {Function} routes for Post resource

  @main routes/authors
  @param {Object} app - express application instance
  @param {Function} restrict - middleware, for protected routes
**/
module.exports = function(app, restrict) {

  /**
    Create a post

    Route: (verb) POST /authors
    @async
  **/
  app.post('/authors', restrict, function (req, res) {
    db.createRecord('authors', req.body.post, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(payload);
      }
    });
  });

  /**
    (Read) Find authors accepts query object

    Route: (verb) GET /authors
    @async
  **/
  app.get('/authors', function (req, res) {
    db.findQuery('authors', req.query, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });

  /**
    (Read) Find a post by id

    Route: (verb) GET /authors/:id
    @async
  **/
  app.get('/authors/:id', function (req, res) {
    db.find('authors', req.params.id, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });

  /**
    Update a post by id

    Route: (verb) PUT /authors/:id
    @async
  **/
  app.put('/authors/:id', restrict, function (req, res) {
    db.updateRecord('authors', req.params.id, req.body.post, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(payload);
      }
    });
  });

  /**
    Patch a post by id

    Route: (verb) PATCH /authors/:id
    @async
  **/
  app.patch('/authors/:id', restrict, function (req, res) {
    db.patchRecord('authors', req.params.id, req.body, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        res.status(204).end();
      }
    });
  });


  /**
    Delete a post by id

    Route: (verb) DELETE /authors/:id
    @async
  **/
  app.del('/authors/:id', restrict, function (req, res) {
    db.deleteRecord('authors', req.params.id, function (err) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(204); // No Content
      }
    });
  });

};
