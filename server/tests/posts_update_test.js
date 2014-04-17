var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('superagent').agent();

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;

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

  describe('PUT responses:', function () {

    describe('/posts/:id', function () {

      it('updates a "post" record, excerpt changed', function (done) {
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

            request.get(serverUrl + '/posts?order=desc')
              .set('Cookie', cookie)
              .end(function (res) {
                assert(res.ok);
                var slug = res.body.posts[0].slug;
                assert(slug);
                var payload = { post: res.body.posts[0] };
                payload.post.excerpt += " [updatable]";
                delete payload.post.id;
                request.put(serverUrl + '/posts/' + slug)
                  .set('Cookie', cookie)
                  .send(payload)
                  .end(function (res) {
                    assert(res.ok);
                    var post = res.body.posts[0];
                    assert(post);
                    assert(post.excerpt.match(/\[updatable\]/));
                    done();
                  });
              });
          });
      });
    });
  });
});
