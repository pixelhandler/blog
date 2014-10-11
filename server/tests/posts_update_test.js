var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('superagent').agent();

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;
var testData = require('../seeds/posts.js');

describe('Posts', function () {

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

  beforeEach(function () {
    testData.sort(compareDateDesc);
  });

  describe('PUT responses:', function () {

    describe('/posts/:id', function () {

      it('updates a "post" record, excerpt changed', function (done) {
        var cookie;
        var credentials = config.admin;
        var randomIdx = Math.floor(Math.random() * testData.length);
        var payload = { posts: testData[randomIdx] };
        var change = " [updatable-" + Date.now() + "]";
        payload.posts.excerpt += change;
        var id = testData[randomIdx].id;
        assert(id);
        delete payload.posts.id;

        request.post(serverUrl + '/sessions')
          .send(credentials)
          .end(function (res) {
            assert(res.ok);
            cookie = res.headers['set-cookie'];
            assert(cookie);
            cookie = cookie[0].slice(0, cookie[0].indexOf(';'));
            request.put(serverUrl + '/posts/' + id)
              .set('Cookie', cookie)
              .send(payload)
              .end(function (res) {
                console.log('res.body', res.body);
                assert(res.ok);
                var post = res.body.posts;
                assert(post);
                assert(post.excerpt.match(new RegExp(change)));
                done();
              });
          });
      });
    });
  });
});

function compareDateDesc(a,b) {
  a = new Date(a.date);
  b = new Date(b.date);
  // Sort desc order
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  } else {
    return 0;
  }
}
