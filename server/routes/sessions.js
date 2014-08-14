/**
  @module app
  @submodule routes/sessions
**/
var loginfo = require('debug')('session:info');
var config = require('../config')();

/**
  Exports {Function} Sessions route

  @main routes/pong
  @param {Object} app - express application instance
  @param {Function} restrict - middleware, for protected routes
**/
module.exports = function(app, restrict) {

  /**
    Route: (verb) GET /sessions
  **/
  app.get('/sessions', function(req, res) {
    loginfo('logged in: %s', req.session.user);
    if (req.session.user) {
      res.status(204).end();
    }
    else {
      res.status(401).end();
    }
  });

  /**
    Route: (verb) POST /sessions
  **/
  app.post('/sessions', function(req, res) {
    var uname = req.body.username;
    var pword = req.body.password;

    if (uname === config.admin.username && pword === config.admin.password) {
      req.session.user = uname;
      loginfo('login: %s', req.session.user);
      req.session.save();
      res.status(201).end();
    }
    else {
      res.status(401).end();
    }
  });

  /**
    Route: (verb) DELETE /sessions
  **/
  app.delete('/sessions', restrict, function(req, res){
    loginfo('logout', req.session.user);
    req.session = null;
    res.send(204);
  });

  /**
    Route (verb) GET /restricted
  **/
  app.post('/restricted', restrict, function(req, res){
    loginfo('restricted');
    res.send(204);
  });

};
