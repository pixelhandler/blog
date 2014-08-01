/**
  @module app
  @main app
**/
var express = require('express');
var env = process.env.NODE_ENV || 'development';
var config = require('./config')();


/**
  Restrict access w/ session
**/
function restrict(req, res, callback) {
  if (req.session) {
    if (req.session.user || req.session.cookie) { // TODO FIXME hacked session, user wasn't found
      callback();
    } else {
      req.session.error = 'Access denied!';
      res.status(403).send(JSON.stringify(req.session.error));
    }
  } else {
    req.session.error = 'No session!';
    res.status(403).send(JSON.stringify(req.session.error));
  }
}


/**
  Application
**/
var app = express();


/**
  Middlewares
**/
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var cookieParser = require('cookie-parser');
app.use(cookieParser(config.session.secret));

var session = require('express-session');
app.use(session({
  name: config.session.cookieName,
  store: new session.MemoryStore(),
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 60 * 30 },
  secret: config.session.secret
}));


/**
  Load application routes [when using express 4 setup routes before middlewares]
**/
//app.use(app.router); // **this line will be removed when running express ver. 4+ **
require('./routes/ping')(app);
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
  var server = app.listen(port);
  console.log('API server listening on port '+ port);

  /**
    Socket Support
  **/
  var io = require('./lib/socket_adapter')(server);

} else {
  module.exports = app;
}
