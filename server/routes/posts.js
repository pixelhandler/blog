/**
  @module app
  @submodule routes/posts
  @requires app, rethinkdb_adapter
**/
var debug = require('debug')('posts');
var node_env = process.env.NODE_ENV || 'development';
var db = require('../lib/rethinkdb_adapter');


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
    var payload = req.body.posts;
    if (payload.id) {
      delete payload.id;
    }
    db.createRecord('posts', payload, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        if (app._io) {
          debug('didAdd', payload);
          app._io.emit('didAdd', payload);
        }
        res.status(201).send(payload);
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
    (Read) Find a post by id or list of ids (comma separated), or by slug

    Route: (verb) GET /posts/[:id[,id...]|:slug]
    @async
  **/
  app.get('/posts/:id', function (req, res) {
    var ids = req.params.id.split(',');
    if (ids.length === 1) {
      db.find('posts', ids[0], function (err, payload) {
        if (err) {
          debug(err);
          res.send(500);
        } else {
          if (node_env != 'development') {
            res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
          }
          if (payload.posts !== null) {
            debug('/posts/:id result not null', payload.posts);
            res.send(payload);
          } else {
            debug('/posts/:id result null, finding by slug');
            db.findBySlug('posts', ids[0], function (err, payload) {
              if (err) {
                debug(err);
                res.send(500);
              } else {
                if (payload.posts !== null) {
                  debug('/posts/:slug result not null', payload.posts);
                  res.send(payload);
                } else {
                  debug('/posts/[:id|:slug] result not found');
                  res.status(404).end();
                }
              }
            });
          }
        }
      });
    } else if (ids.length > 1) {
      db.findMany('posts', ids, function (err, payload) {
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
    }
  });

  /**
    Update a post by id

    Route: (verb) PUT /posts/:id
    @async
  **/
  app.put('/posts/:id', restrict, function (req, res) {
    db.updateRecord('posts', req.params.id, req.body.post, function (err, payload) {
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

    Route: (verb) PATCH /posts/:id
    @async
  **/
  app.patch('/posts/:id', restrict, function (req, res) {
    db.patchRecord('posts', req.params.id, req.body, function (err, payload) {
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

    Route: (verb) DELETE /posts/:id
    @async
  **/
  app.delete('/posts/:id', restrict, function (req, res) {
    db.deleteRecord('posts', req.params.id, function (err) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        if (app._io) {
          var payload = {posts: {id: req.params.id}};
          debug('didRemove', payload);
          app._io.emit('didRemove', payload);
        }
        res.send(204); // No Content
      }
    });
  });

};
