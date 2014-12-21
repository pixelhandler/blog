var app  = require(__dirname + '/../app.js');
var port = 8888;
var assert = require('assert');
var request = require('superagent').agent();
var db = require('rethinkdb_adapter');

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;
var posts = 'posts';
var testData = require('../seeds/' + posts + '.js');
var authorData = require('../seeds/authors.js');

describe('Posts', function () {
  var sessionUrl = serverUrl + '/sessions';
  var cookie;

  before(function (done) {
    this.server = app.listen(port, function (err, result) {
      if (err) {
        done(err);
      } else {
        var credentials = config.admin;
        request.post(sessionUrl)
          .send(credentials)
          .end(function (res) {
            assert(res.ok);
            cookie = res.headers['set-cookie'];
            assert(cookie, 'session cookie ok');
            cookie = cookie[0].slice(0, cookie[0].indexOf(';'));
            done();
          });
      }
    });
  });

  after(function (done) {
    request.del(sessionUrl).end(function () {
      this.server.close();
      done();
    }.bind(this));
  });

  beforeEach(function () {
    testData.sort(compareDateDesc);
  });

  describe('Request Method:PATCH', function () {

    describe('replace operation', function () {

      beforeEach(function() {
        var randomIdx = Math.floor(Math.random() * testData.length);
        var record = testData[randomIdx];
        this.recordId = record.id;
        assert(this.recordId, 'post id to patch ok');
        var change = " [patchable-" + Date.now() + "]";
        this.ogTitle = record.title;
        this.changedTitle = record.title + change;
      });

      afterEach(function(done) {
        var changedTitle = this.changedTitle;
        var ogTitle = this.ogTitle;
        var id = this.recordId;

        db.find(posts, this.recordId, function (err, payload) {
          assert(!err, 'db find did not error');
          var title = payload[posts].title;
          assert.equal(title, changedTitle, 'title changed successfully');
          assert.notEqual(title, ogTitle, 'title does not match original');
          db.updateRecord(posts, id, {title: ogTitle}, function (err, payload) {
            assert(!err, 'db find did not error');
            done();
          });
        });
      });

      it('changes title', function (done) {
        var id = this.recordId;
        var payload = [{
          op: 'replace',
          path: '/title',
          value: this.changedTitle
        }];
        var url = [serverUrl, posts, id].join('/');
        request.patch(url)
          .set('Cookie', cookie)
          .send(payload)
          .end(function (res) {
            assert(res.ok, 'patch request responded ok');
            done();
          });
      });

    });

    describe('add operation', function () {
      beforeEach(function() {
        this.id = db.uuid();
        this.payload = [
          {
            "op": "add",
            "path": "/-",
            "value": {
              "id": this.id,
              "slug": "add-a-post",
              "title": "add a post",
              "date": "2014-10-10",
              "excerpt": "patching ",
              "body": "add a post",
              "links": {
                "author": null
              }
            }
          }
        ];
      });

      afterEach(function(done) {
        assert(this.id, 'id to delete ok');
        db.deleteRecord(posts, this.id, function(err) {
          assert(!err, 'db deleteRecord did not error');
          done();
        });
        delete this.payload;
        delete this.id;
      });

      it('creates a record', function(done) {
        var id = this.id;
        var payload = this.payload;
        var url = [serverUrl, posts].join('/');
        request.patch(url)
          .set('Cookie', cookie)
          .send(payload)
          .end(function (res) {
            assert(res.ok, 'patch request responded ok');
            done();
          });
      });

    });

    describe('Author link', function () {
      beforeEach(function(done) {
        var uuid = this.id = db.uuid();
        var record = {
          "id": uuid,
          "slug": "temp post",
          "title": "temp post",
          "date": "2014-10-16",
          "excerpt": "temp post",
          "body": "temp post",
          "links": {
            "author": null
          }
        };

        db.createRecord(posts, record, function(err, payload) {
          assert(!err, 'db createRecord did not error');
          assert.equal(payload.posts.id, uuid, 'id of post to link author to is ok');
          done();
        });
      });

      afterEach(function(done) {
        assert(this.id, 'id to delete ok');
        db.deleteRecord(posts, this.id, function(err) {
          assert(!err, 'db deleteRecord did not error');
          done();
        });
      });

      it('replaces an author link id', function(done) {
        var id = this.id;
        var payload = [
          {
            "op": "replace",
            "path": "/",
            "value": authorData[0].id
          }
        ];
        var url = [serverUrl, posts, id, "links", "author"].join('/');
        request.patch(url)
          .set('Cookie', cookie)
          .send(payload)
          .end(function (res) {
            assert(res.ok, 'patch request responded ok');
            done();
          });
      });
    });

    describe('remove operation', function () {

      beforeEach(function(done) {
        var uuid = db.uuid();
        var record = {
          "id": uuid,
          "slug": "temp post",
          "title": "temp post",
          "date": "2014-10-14",
          "excerpt": "temp post",
          "body": "temp post",
          "links": {
            "author": null
          }
        };
        db.createRecord(posts, record, function(err, payload) {
          assert(!err, 'db createRecord did not error');
          assert.equal(payload.posts.id, uuid, 'id of post to delete ok');
          done();
        });
        this.id = uuid;
      });

      afterEach(function(done) {
        var id = this.id;
        assert(id, 'id to delete ok');
        db.find(posts, id, function (err, payload) {
          if (!err) {
            db.deleteRecord(posts, id, function (_err, result) {
              assert(!_err, 'db deleteRecord did not error');
              assert.equal(err, null, 'db find did error, post id not found: ' + id);
              done();
            });
          } else {
            assert(err, 'db find did error, post id not found: ' + id);
            done();
          }
        });
        delete this.id;
      });

      it('deletes a record', function(done) {
        var id = this.id;
        var payload = [
          {
            "op": "remove",
            "path": "/"
          }
        ];
        var url = [serverUrl, posts, id].join('/');
        request.patch(url)
          .set('Cookie', cookie)
          .send(payload)
          .end(function (res) {
            assert(res.ok, 'patch request responded ok'); // 204
            done();
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
