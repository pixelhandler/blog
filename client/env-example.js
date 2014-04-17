'use-strict';

window.EmberENV = {
  "localhost": {
    "API_HOST": "http://localhost:8888",
    "SOCKET_URL": "http://localhost:8888"
    "GOOGLE_ANALYTICS": null
  },
  "domain.com": {
    "API_HOST": "http://api.domain.com",
    "SOCKET_URL": "http://socket.domain.com"
    "GOOGLE_ANALYTICS": "UA-XXXXXXX-1"
  }
}[window.location.hostname];

module.exports = window.EmberENV;