import config from '../config/environment';

export function SocketService() {
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
    if (navigator.onLine && canUseSocket()) {
      socket = window.io(config.APP.SOCKET_URL);
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
      console.warn('Your network is offline');
    }
  } catch (e) {
    if (typeof window.io === 'undefined') {
      throw new Error('Socket.io client library not loaded');
    }
  }
  instance = socket;

  return instance;
};

export function canUseSocket() {
  return window.WebSocket && notPrerenderService();
}

function notPrerenderService() {
  return window.navigator.userAgent.match(/Prerender/) === null;
}
