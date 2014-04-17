var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('supertest');

describe('app: server/index.js', function () {

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

  it('exists', function (done) {
    assert.ok(app);
    done();
  });

  it('listens on port ' + port, function (done) {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect(404, done);
  });

  it('responds to GET /ping with "pong"', function (done) {
    request(app)
      .get('/ping')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, /pong/, done);
  });

});
