/**
  @module app
  @submodule routes/sessions
**/
var loginfo = require('debug')('session:info');
var config = require('../config')();

/**
  Exports {Function} ping route, responds with 'pong'

  @main routes/pong
  @param {Object} app - express application instance
  @param {Function} options - middleware callback (cors options)
**/
module.exports = function(app, cors, restrict) {

  /**
    Route: (verb) POST /sessions
  **/
  app.post('/sessions', cors, function(req, res) {
    var uname = req.body.username;
    var pword = req.body.password;

    if (uname === config.admin.username && pword === config.admin.password) {
      req.session.user = uname;
      loginfo('login: %s', req.session.user);
      res.send(204);
    }
    else {
      res.send(401);
    }
  });

  /**
    Route: (verb) DELETE /sessions
  **/
  app.del('/sessions', cors, restrict, function(req, res){
    req.session = null;
    res.send(204);
  });

  /**
    Route (verb) GET /restricted
  **/
  app.post('/restricted', cors, restrict, function(req, res){
    res.send(204);
  });

};
