'use-strict';

function SocketService() {
  return this;
}

var _service;

SocketService.create = function () {
  if (_service) return _service; // singleton socket service instance
  var socket;
  try {
    //if (navigator.onLine) {
    socket = window.io.connect(window.EmberENV.SOCKET_URL);
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
  _service = socket;

  return _service;
};

module.exports = SocketService;
