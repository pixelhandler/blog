/**
  @module app
  @submodule routes/ping
**/

/**
  Exports {Function} ping route, responds with 'pong'

  @main routes/pong
  @param {Object} app - express application instance
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
