var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('supertest');

var testData = require('../seeds/posts.js');

var newestDate = testData[0].date.toISOString();
var oldestDate = testData[8].date.toISOString();

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

  describe('GET responses:', function () {

    describe('/posts', function () {

      describe('root key of payload', function () {

        it('is "posts"', function (done) {
          request(app)
            .get('/posts')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(/posts/)
            .expect(function (res) {
              var posts = res.body.posts;
              if (!posts) throw new Error('expected posts');
            })
            .end(handleDone(done));
        });

        it('sorts in DESC order of "date" property by default', function (done) {
          request(app)
            .get('/posts')
            .expect(function (res) {
              var posts = res.body.posts;
              if (posts[0].date !== newestDate) throw new Error('expected desc order ('+ newestDate +')');
              if (posts[8].date !== oldestDate) throw new Error('expected desc order ('+ oldestDate +')');
            })
            .end(handleDone(done));
        });

        it('has an array of posts with keys for author, body, date, excerpt, title, id', function (done) {
          request(app)
            .get('/posts')
            .expect(/author/).expect(/body/).expect(/date/).expect(/excerpt/).expect(/title/).expect(/id/)
            .expect(function (res) {
              var posts = res.body.posts;
              if (posts[0].title !== testData[0].title) throw new Error('expected first post title');
              if (posts[8].title !== testData[8].title) throw new Error('expected last post title');
            })
            .end(handleDone(done));
        });

        it('includes two ('+ testData.length +') posts (from seed data)', function (done) {
          request(app)
            .get('/posts')
            .expect(function (res) {
              var posts = res.body.posts;
              if (posts.length !== testData.length) throw new Error('expected '+ testData.length +' posts');
            })
            .end(handleDone(done));
        });
      });

      describe('meta data in payload', function () {

        it('includes keys: limit, offset, total, order, sortBy', function (done) {
          request(app)
            .get('/posts')
            .expect(/meta/)
            .expect(/limit/).expect(/offset/).expect(/total/)
            .expect(/order/).expect(/sortBy/)
            .expect(function (res) {
              var meta = res.body.meta;
              if (!meta) throw new Error('expected meta');
              if (meta.total !== testData.length) throw new Error('expected total of '+ testData.length);
            })
            .end(handleDone(done));
        });
      });

      describe('query parameters', function () {

        describe('default sortBy setting is the "date" key', function () {

          it('sorts DESC order with "order=desc" param', function (done) {
            request(app)
              .get('/posts?order=desc')
              .expect(function (res) {
                var posts = res.body.posts;
                if (posts[0].title !== testData[0].title) throw new Error('expected 1st post title');
                if (posts[0].date !== newestDate) throw new Error('expected desc order ('+ newestDate +')');
                if (posts[8].title !== testData[8].title) throw new Error('expected 2nd post title');
                if (posts[8].date !== oldestDate) throw new Error('expected desc order ('+ oldestDate +')');
              })
              .end(handleDone(done));
          });

          it('sorts ASC order with "order=asc" param', function (done) {
            request(app)
              .get('/posts?order=asc')
              .expect(function (res) {
                var posts = res.body.posts;
                if (posts[0].date !== oldestDate) throw new Error('expected asc order ('+ oldestDate +')');
                if (posts[8].date !== newestDate) throw new Error('expected asc order ('+ newestDate +')');
              })
              .end(handleDone(done));
          });

          it('limits records using "limit=" param', function (done) {
            request(app)
              .get('/posts?limit=1')
              .expect(function (res) {
                var posts = res.body.posts;
                if (posts.length !== 1) throw new Error('expected 1 of '+ testData.length +' records');
                if (posts[0].date !== newestDate) throw new Error('expected '+ oldestDate);
              })
              .end(handleDone(done));
          });

          it('skips records using "offset=" param', function (done) {
            request(app)
              .get('/posts?offset=' + (testData.length - 1).toString())
              .expect(function (res) {
                var posts = res.body.posts;
                if (posts.length !== 1) throw new Error('expected 1 of '+ testData.length +' records');
                if (posts[0].date !== oldestDate) throw new Error('expected ' + oldestDate);
              })
              .end(handleDone(done));
          });
        });

        describe('sortBy param', function () {

          describe('default order is DESC', function () {

            it('can sortBy "title" key (instead of default "date" key)', function (done) {
              var sortedTestData = testData.sort(compareTitle);
              request(app)
                .get('/posts?sortBy=title')
                .expect(function (res) {
                  var posts = res.body.posts;
                  if (posts[0].title !== testData[8].title) throw new Error('expected first post title');
                  if (posts[8].title !== testData[0].title) throw new Error('expected last post title');
                })
                .end(handleDone(done));
            });
          });

        });
      });
    });

    describe('/posts/:slug', function () {

      it('includes one "post" record in the payload', function (done) {
        request(app)
          .get('/posts?order=desc')
          .end(function (err, res) {
            if (err) return done(err);
            var slug = res.body.posts[0].slug;
            request(app)
              .get('/posts/' + slug)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .expect(/posts/)
              .expect(/author/).expect(/body/).expect(/date/).expect(/excerpt/).expect(/title/).expect(/id/).expect(/slug/)
              .expect(function (res) {
                if (res.body.posts.length > 1) throw new Error('expected one record');
                var post = res.body.posts[0];
                if (!post) throw new Error('expected post slug: ' + slug);
                if (post.title !== testData[0].title) throw new Error('expected first post title');
              })
              .end(handleDone(done));
          });
      });
    });

  });
});

function handleDone(done) {
  return function (err, res) {
    if (err) return done(err);
    done();
  };
}

function compareTitle(a,b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}
