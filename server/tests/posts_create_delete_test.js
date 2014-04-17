var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('superagent').agent();

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;

describe('Posts', function () {
  var postId;

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

  describe('POST/DELETE responses:', function () {

    describe('/posts', function () {

      it('create a "post" record, then "delete" it', function (done) {
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

            request.post(serverUrl + '/posts')
              .set('Content-Type', 'application/json; charset=UTF-8')
              .send(newPost)
              .set('Cookie', cookie)
              .end(function (res) {
                assert(res.ok);
                var post = res.body.posts[0];
                assert(post);
                assert(post.title.match(/New Post/));

                var slug = post.slug;
                assert(slug);
                request.del(serverUrl + '/posts/' + slug)
                  .set('Cookie', cookie)
                  .end(function (res) {
                    assert(res.noContent);
                    done();
                  });
              });
          });
      });
    });
  });
});

var newPost = {
  post: {
    slug: "new_post",
    title: "New Post",
    author: { name: "bot" },
    date: Date.now,
    excerpt: "Nothing special.",
    body: "New post body content, blah, blah..."
  }
};
