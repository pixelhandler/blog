'use-strict';

window.EmberENV = {
  API_HOST: null
};

var hostname = window.location.hostname;

if (hostname === 'localhost') {
  // development
  window.EmberENV.API_HOST = 'http://localhost:8888';
} else if (hostname.match(/pixelhandler/) !== null) {
  // production
  window.EmberENV.API_HOST = 'http://107.170.232.223:8888';
}

module.exports = window.EmberENV;