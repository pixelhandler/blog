/**
  @module app
  @submodule routes/posts
  @requires app, rethinkdb_adapter
**/
var debug = require('debug')('posts');
var node_env = process.env.NODE_ENV || 'development';

/**
  Setup database
**/
var db = require('../lib/rethinkdb_adapter');
db.setup('blog', { catalogs: 'id', posts: 'id' });


/**
  Exports {Function} routes for Post resource

  @main routes/posts
  @param {Object} app - express application instance
  @param {Function} restrict - middleware, for protected routes
**/
module.exports = function(app, restrict) {

  /**
    Create a post

    Route: (verb) POST /posts
    @async
  **/
  app.post('/posts', restrict, function (req, res) {
    db.createRecord('posts', req.body.post, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(payload);
      }
    });
  });

  /**
    (Read) Find posts accepts query object

    Route: (verb) GET /posts
    @async
  **/
  app.get('/posts', function (req, res) {
    db.findQuery('posts', req.query, function (err, payload) {
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
    (Read) Find a post by slug

    Route: (verb) GET /posts/:slug
    @async
  **/
  app.get('/posts/:slug', function (req, res) {
    db.find('posts', req.params.slug, function (err, payload) {
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
    Update a post by slug

    Route: (verb) PUT /posts/:slug
    @async
  **/
  app.put('/posts/:slug', restrict, function (req, res) {
    db.updateRecord('posts', req.params.slug, req.body.post, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(payload);
      }
    });
  });

  /**
    Delete a post by slug

    Route: (verb) DELETE /posts/:slug
    @async
  **/
  app.del('/posts/:slug', restrict, function (req, res) {
    db.deleteRecord('posts', req.params.slug, function (err) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(204); // No Content
      }
    });
  });

};
