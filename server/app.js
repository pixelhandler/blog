/**
  @module app
  @main app
**/
var express = require('express');
var env = process.env.NODE_ENV || 'development';
var config = require('./config')();
var loginfo = require('debug')('app:info');


/**
  Restrict access w/ session
**/
function restrict(req, res, callback) {
  if (req.session) {
    if (req.session.user) {
      callback();
    } else {
      req.session.error = 'Access denied!';
      res.send(403, JSON.stringify(req.session.error));
    }
  } else {
    req.session.error = 'No session!';
    res.send(403, JSON.stringify(req.session.error));
  }
}


/**
  Application
**/
var app = express();

/**
  enable CORs pre-flighting, include before other routes
**/
var cors = require('cors');

/**
  Cors settings, https://www.npmjs.org/package/cors
**/
var options = {
  origin: function(origin, callback){
    var allowed = config.allowed;
    var isAllowed = allowed.indexOf(origin) !== -1;
    //loginfo('[cors] config allows: ' + allowed.join(', '));
    //loginfo('[cors] origin: ' + origin + ' isAllowed: ' + isAllowed);
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['POST', 'PUT', 'GET', 'DELETE']
};
app.options('*', cors(options));


/**
  Load application routes [when using express 4 setup routes before middlewares]
**/
//app.use(app.router); // **this line will be removed when running express ver. 4+ **
require('./routes/ping')(app, cors(options));
require('./routes/posts')(app, cors(options), restrict);
require('./routes/sessions')(app, cors(options), restrict);


/**
  Middlewares
**/
var cookieParser = require('cookie-parser');
app.use(cookieParser(config.session.secret));

var session = require('express-session');
app.use(session({
  name: config.session.cookieName,
  store: new session.MemoryStore(),
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 60 * 30 },
  secret: config.session.secret
}));

var compression = require('compression');
app.use(compression());

var bodyParser = require('body-parser');
app.use(bodyParser.json());

//var methodOverride = require('method-override');
//app.use(methodOverride());

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
  console.log('CORS-enabled web server listening on port '+ port);

  /**
    Socket Support
  **/
  var io = require('./lib/socket_adapter')(server);

} else {
  module.exports = app;
}
