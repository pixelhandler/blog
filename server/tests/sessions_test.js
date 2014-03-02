var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('superagent').agent();

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;

describe('Sessions', function () {

  before(function (done) {
    this.server = app.listen(port, function (err, result) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  after(function () {
    this.server.close();
  });

  it('cannot access restricted endpoint /restricted', function () {
    request.post(serverUrl + '/restricted')
      .end(function (res) {
        assert(res.clientError);
        assert(res.forbidden);
      });
  });

  var credentials = config.admin;

  it('POST /sessions w/ username & password; access restricted; DELETE /sessions', function (done) {
    var cookie;
    var credentials = config.admin;
    request.post(serverUrl + '/sessions')
      .send(credentials)
      .end(function (res) {
        assert(res.ok);
        assert(res.noContent);
        cookie = res.headers['set-cookie'];
        assert(cookie);
        cookie = cookie[0].slice(0, cookie[0].indexOf(';'));

        request.post(serverUrl + '/restricted')
          .set('Cookie', cookie) //.withCredentials()
          .end(function (res) {
            assert(res.ok);
            assert(res.noContent);

            request.del(serverUrl + '/sessions')
              .set('Cookie', cookie) //.withCredentials()
              .end(function (res) {
                assert(res.ok);
                assert(res.noContent);

                done();
              });
          });
      });
  });
});
