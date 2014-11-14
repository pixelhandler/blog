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
    db.createRecord('posts', req.body.posts, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        debug('payload', payload.posts);
        if (app._io) {
          debug('didAdd', payload);
          app._io.emit('didAdd', payload);
        }
        res.status(201).send(payload);
      }
    });
  });

  /**
    Create an author link on a post

    Route: (verb) POST /posts/:id/links/author
    @async
  **/
  app.post('/posts/:id/links/author', restrict, function (req, res) {
    debug('/posts/:id/links/author', req.params.id, req.body);
    var id = req.params.id;
    var links = { links: { author: req.body.authors } };
    db.updateRecord('posts', id, links, function (err) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        if (app._io) {
          var payload = { 'posts': req.body };
          debug('didAddLink', payload);
          app._io.emit('didAddLink', payload);
        }
        res.status(204).end(); // No Content
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
            res.send(payload);
          } else {
            db.findBySlug('posts', ids[0], function (err, payload) {
              if (err) {
                debug(err);
                res.send(500);
              } else {
                if (payload.posts !== null) {
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
    db.updateRecord('posts', req.params.id, req.body.posts, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        res.status(204).end(); // No Content
      }
    });
  });

  /**
    Create an author link on a post

    Route: (verb) POST /posts/:id/links/author
    @async
  **/
  app.put('/posts/:id/links/author', restrict, function (req, res) {
    debug('/posts/:id/links/author', req.params.id, req.body);
    var id = req.params.id;
    var links = { links: { author: req.body.authors } };
    db.updateRecord('posts', id, links, function (err) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        if (app._io) {
          var payload = { 'posts': req.body };
          debug('didAddLink', payload);
          app._io.emit('didAddLink', payload);
        }
        res.status(204).end(); // No Content
      }
    });
  });


  /**
    Create a post using patch, `add` operation

    Route: (verb) PATCH /posts
    @async
  **/
  app.patch('/posts', restrict, function (req, res) {
    if (!Array.isArray(req.body)) return;
    // TODO actually support more than one item in the request array
    req.body.forEach(function (patch) {
      if (patch.op && patch.op === 'add') {
        db.createRecord('posts', patch.value, function (err, payload) {
          if (err) {
            debug(err);
            res.status(500).end();
          } else {
            if (app._io) {
              debug('didAdd', payload);
              app._io.emit('didAdd', payload);
            }
            res.status(201).send(payload);
          }
        });
      }
    });
  });

  /**
    Patch a post by id, supports replace and remove operations

    Route: (verb) PATCH /posts/:id
    @async
  **/
  app.patch('/posts/:id', restrict, function (req, res) {
    db.patchRecord('posts', req.params.id, req.body, function (err) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        res.status(204).end();
      }
    });
  });

  /**
    Patch an author link on a post with replace/remove operations

    Route: (verb) PATCH /posts/:id/links/author
    @async
  **/
  app.patch('/posts/:id/links/author', restrict, function (req, res) {
    var operation = req.body[0];
    if (operation.op.match(/(replace|remove)/) === null) {
      res.status(400).end();
    }
    var id = req.params.id;
    var authorId = /*replace*/ operation.value || /*remove*/ null;
    var links = { links: { author: authorId } };
    db.updateRecord('posts', id, links, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        if (app._io) {
          debug('didPatchLink', payload);
          app._io.emit('didPatchLink', payload);
        }
        res.status(204).end(); // No Content
      }
    });
  });

  /**
    TODO Support root level patch requests

    Route: (verb) PATCH /
    @async
  **/
  app.patch('/', restrict, function (req, res) {
    debug('patch / unsupported', req.params, req.body);
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
        res.status(500).end();
      } else {
        if (app._io) {
          var payload = { posts: req.params.id };
          debug('didRemove', payload);
          app._io.emit('didRemove', payload);
        }
        res.status(204).end(); // No Content
      }
    });
  });

  /**
    TODO Delete an author from a post

    Route: (verb) DELETE /posts/:id/links/author
    @async
  **/
  app.delete('/posts/:id/links/author', restrict, function (req, res) {
    var id = req.params.id;
    payload = { links: { author: null } };
    db.updateRecord('posts', id, payload, function (err) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        if (app._io) {
          var payload = { posts: req.body };
          debug('didRemoveLink', payload);
          app._io.emit('didRemoveLink', payload);
        }
        res.status(204).end(); // No Content
      }
    });
  });

};
