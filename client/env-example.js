'use-strict';

window.EmberENV = {
  "localhost": {
    "API_HOST": "http://localhost:8888",
    "SOCKET_URL": "http://localhost:8888",
    "DISQUS_SHORTNAME": false,
    "GOOGLE_ANALYTICS": false
  },
  "domain.com": {
    "API_HOST": "http://api.domain.com",
    "SOCKET_URL": "http://socket.domain.com",
    "DISQUS_SHORTNAME": "disqus_username",
    "GOOGLE_ANALYTICS": "UA-XXXXXXX-1"
  }
}[window.location.hostname];

module.exports = window.EmberENV;
