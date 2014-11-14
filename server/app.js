/**
  @module app
  @main app
**/
var express = require('express');
var env = process.env.NODE_ENV || 'development';
var config = require('./config')();
var debug = require('debug')('app:debug');


/**
  Application
**/
var app = express();


/**
  Middlewares
**/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.json({type: 'application/json-patch+json'}));

var session = require('express-session');
var sessionMiddleware = session({
  cookie: { secure: false },
  secret: config.session.secret
});
app.use(sessionMiddleware);


/**
  Setup database
**/
var db = require('./lib/rethinkdb_adapter');
db.setup('blog', { catalogs: 'id', posts: 'id', authors: 'id' });


/**
  Restrict access with session
**/
function restrict(req, res, callback) {
  if (req.session) {
    if (req.session.user) {
      debug('req.session.user', req.session.user);
      callback();
    } else {
      req.session.error = 'Access denied!';
      debug('req.session.error', req.session.error);
      res.status(403).send(JSON.stringify(req.session.error));
    }
  } else {
    req.session.error = 'No session!';
    debug('req.session.error', req.session.error);
    res.status(403).send(JSON.stringify(req.session.error));
  }
}


/**
  Load application routes [when using express 4 setup routes before middlewares]
**/
require('./routes/ping')(app);
require('./routes/authors')(app, restrict);
require('./routes/posts')(app, restrict);
require('./routes/sessions')(app, restrict);


/**
  Middlewares
**/
var compression = require('compression');
app.use(compression());

var methodOverride = require('method-override');
app.use(methodOverride());


if ('development' == env) {
  var errorhandler = require('errorhandler');
  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
}

// Static server, used for socket support, serving client lib, etc.
app.use(express.static(__dirname + '/'));


/**
  Listen, or export if required by testing
**/
if (!module.parent) {
  var port = config.port || process.env.SERVER_PORT || 8888;
  var http = require('http').Server(app);

  /**
    Socket Support
  **/
  var io = require('./lib/socket_adapter')(http, sessionMiddleware);
  app._io = io;

  http.listen(port, function () {
    debug('API server listening on port '+ port);
  });
} else {
  module.exports = app;
}
