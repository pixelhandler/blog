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
    if (navigator.onLine) {
      socket = window.io(PixelhandlerBlogENV.SOCKET_URL);
      socket.on('connect_failed', function () {
        socket = undefined;
      });
      socket.on('connect_timeout', function () {
        socket = undefined;
      });
      socket.on('error', function (e) {
        console.error('Socket Error!', e);
      });
    } else {
      window.alert('Your network is offline');
    }
  } catch (e) {
    if (typeof window.io === 'undefined') {
      throw new Error('Socket.io client library not loaded');
    }
  }
  instance = socket;

  return instance;
};

export default SocketService;
