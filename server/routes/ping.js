/**
  @module app
  @submodule routes/ping
**/

/**
  Exports {Function} ping route, responds with 'pong'

  @main routes/pong
  @param {Object} app - express application instance
  @param {Function} options - middleware callback (cors options)
**/
module.exports = function(app) {

  /**
    Route: (verb) GET /ping
    - Used for test to confirm simple response
  **/
  app.get('/ping', function (req, res) {
    res.send('pong');
  });

};
