var staticServer = require('node-static');
var createServer = require('http').createServer;

// Create a node-static server instance to serve the './public' folder
exports.startServer = function (port, publicPath, log) {
  port = port || process.env.CLIENT_PORT || 8000;
  publicPath = publicPath || './public';

  var fileServer = new staticServer.Server(publicPath);

  createServer(function (request, response) {

    request.addListener('end', function () {
      fileServer.serve(request, response, function (err, res) {
        if (err && (err.status === 404)) { // Not found
          fileServer.serveFile('/index.html', 200, {}, request, response);
        }
      });

    }).resume();

  }).listen(port);
};
