var app  = require(__dirname + '/../app.js');
var port = 8888;
var assert = require('assert');
var request = require('superagent').agent();
var db = require('../lib/rethinkdb_adapter');

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;
var authors = 'authors';
var postsData = require('../seeds/posts.js');
var authorsData = require('../seeds/' + authors + '.js');

describe('Authors', function () {
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
    postsData.sort(compareDateDesc);
  });

  describe('Request Method:PATCH', function () {

    describe('replace operation', function () {

      beforeEach(function() {
        var randomIdx = Math.floor(Math.random() * authorsData.length);
        var record = authorsData[randomIdx];
        this.recordId = record.id;
        assert(this.recordId, 'author id to patch ok');
        var change = " [patchable-" + Date.now() + "]";
        this.ogName = record.name;
        this.changedName = record.name + change;
      });

      afterEach(function(done) {
        var changedName = this.changedName;
        var ogName = this.ogName;
        var id = this.recordId;

        db.find(authors, this.recordId, function (err, payload) {
          assert(!err, 'db find did not error');
          var name = payload[authors].name;
          assert.equal(name, changedName, 'name changed successfully');
          assert.notEqual(name, ogName, 'name does not match original');
          db.updateRecord(authors, id, {name: ogName}, function (err, payload) {
            assert(!err, 'db find did not error');
            done();
          });
        });
      });

      it('changes name', function (done) {
        var id = this.recordId;
        var payload = [{
          op: 'replace',
          path: '/name',
          value: this.changedName
        }];
        var url = [serverUrl, authors, id].join('/');
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
              "email": "yo@somebody.com",
              "name": "nobody",
              "links": {
                "posts": []
              }
            }
          }
        ];
      });

      afterEach(function(done) {
        assert(this.id, 'id to delete ok');
        db.deleteRecord(authors, this.id, function(err) {
          assert(!err, 'db deleteRecord did not error');
          done();
        });
        delete this.payload;
        delete this.id;
      });

      it('creates a record', function(done) {
        var id = this.id;
        var payload = this.payload;
        var url = [serverUrl, authors].join('/');
        request.patch(url)
          .set('Cookie', cookie)
          .send(payload)
          .end(function (res) {
            assert(res.ok, 'patch request responded ok');
            done();
          });
      });

    });

    describe('Post links', function () {
      beforeEach(function(done) {
        var uuid = this.id = db.uuid();
        var record = {
          "id": this.id,
          "email": "yo@somebody.com",
          "name": "nobody",
          "links": {
            "posts": []
          }
        };

        db.createRecord(authors, record, function(err, payload) {
          assert(!err, 'db createRecord did not error');
          assert.equal(payload.authors.id, uuid, 'id of post to link author to is ok');
          done();
        });
      });

      afterEach(function(done) {
        assert(this.id, 'id to delete ok');
        db.deleteRecord(authors, this.id, function(err) {
          assert(!err, 'db deleteRecord did not error');
          done();
        });
      });

      describe('add operation', function() {

        it('adds a post link id', function(done) {
          var id = this.id;
          var payload = [
            {
              "op": "add",
              "path": "/-",
              "value": postsData[0].id
            }
          ];
          var url = [serverUrl, authors, id, "links", "posts"].join('/');
          request.patch(url)
            .set('Cookie', cookie)
            .send(payload)
            .end(function (res) {
              assert(res.ok, 'patch request responded ok');
              done();
            });
        });
      });

      describe('remove operation', function() {

        beforeEach(function(done) {
          this.postId = db.uuid();
          var payload = { links: { posts: [ this.postId ] } };
          db.updateRecord('authors', this.id, payload, function(err, record) {
            assert(!err, 'db updateRecord did not error');
            done();
          });
        });

        it('removes a post link id', function(done) {
          var id = this.id;
          var payload = [
            {
              "op": "remove",
              "path": "/" + this.postId
            }
          ];
          var url = [serverUrl, authors, id, "links", "posts"].join('/');
          request.patch(url)
            .set('Cookie', cookie)
            .send(payload)
            .end(function (res) {
              assert(res.ok, 'patch request responded ok');
              done();
            });
        });

        afterEach(function(done) {
          db.find('authors', this.id, function(err, record) {
            assert(!err, 'db find did not error');
            assert.equal(record.authors.links.posts.length, 0, "no related posts");
            done();
          });
        });

      });
    });

    describe('remove operation', function () {

      beforeEach(function(done) {
        var uuid = this.id = db.uuid();
        var record = {
          "id": this.id,
          "email": "yo@somebody.com",
          "name": "nobody",
          "links": {
            "posts": []
          }
        };
        db.createRecord(authors, record, function(err, payload) {
          assert(!err, 'db createRecord did not error');
          assert.equal(payload.authors.id, uuid, 'id of post to delete ok');
          done();
        });
      });

      afterEach(function(done) {
        var id = this.id;
        assert(id, 'id to delete ok');
        db.find(authors, id, function (err, payload) {
          if (!err) {
            db.deleteRecord(authors, id, function (_err, result) {
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
        var url = [serverUrl, authors, id].join('/');
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
