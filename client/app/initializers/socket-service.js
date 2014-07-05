/* TODO
function SocketService() {
  return this;
}

var instance;

SocketService.create = function () {
  if (instance) {
    // singleton socket service instance
    return instance;
  }
  var socket;
  try {
    //if (navigator.onLine) {
    socket = window.io(PixelhandlerBlogENV.SOCKET_URL);
    socket.on('connect_failed', function () {
      socket = undefined;
    });
    socket.on('error', function (e) {
      console.log('Socket Error!', e);
      throw new Error('Socket Error!', e);
    });
    //}
  } catch (e) {
    if (typeof window.io === 'undefined') {
      throw new Error('Socket.io client library not loaded');
    }
  }
  instance = socket;

  return instance;
};
*/

export default {
  name: 'socket-service',

  initialize: function (/*container, application*/) {
    //container.register('socket:main', SocketService, { singleton: false });
    //application.inject('controller', 'socket', 'socket:main');
    //application.inject('route', 'socket', 'socket:main');
    /* TODO
    var model = container.lookup('model:main');
    model.constructor.prototype.socket = container.lookup('socket:main');
    */
  }
};
