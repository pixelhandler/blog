/**
  @module app
  @submodule routes/posts
  @requires app, rethinkdb_adapter
**/
var debug = require('debug')('posts');

/**
  Setup database
**/
var db = require('../lib/rethinkdb_adapter');
db.setup('blog', { catalogs: 'id', posts: 'id' });


/**
  Exports {Function} routes for Post resource

  @main routes/posts
  @param {Object} app - express application instance
  @param {Function} options - middleware callback (cors options)
**/
module.exports = function(app, cors, restrict) {

  /**
    Create a post

    Route: (verb) POST /posts
    @async
  **/
  app.post('/posts', cors, restrict, function (req, res) {
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
  app.get('/posts', cors, function (req, res) {
    db.findQuery('posts', req.query, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        res.send(payload);
      }
    });
  });

  /**
    (Read) Find a post by slug

    Route: (verb) GET /posts/:slug
    @async
  **/
  app.get('/posts/:slug', cors, function (req, res) {
    db.findBySlug('posts', req.params.slug, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        res.send(payload);
      }
    });
  });

  /**
    Update a post by slug

    Route: (verb) PUT /posts/:slug
    @async
  **/
  app.put('/posts/:slug', cors, restrict, function (req, res) {
    db.updateRecordBySlug('posts', req.params.slug, req.body.post, function (err, payload) {
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
  app.del('/posts/:slug', cors, restrict, function (req, res) {
    db.deleteRecordBySlug('posts', req.params.slug, function (err) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.send(204); // No Content
      }
    });
  });

};
