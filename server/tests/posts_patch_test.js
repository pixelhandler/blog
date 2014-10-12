var app  = require(__dirname + '/../app.js'),
  port = 8888,
  assert = require('assert'),
  request = require('superagent').agent(),
  db = require('../lib/rethinkdb_adapter');

var config = require('../config')();
var serverUrl = 'http://localhost:' + port;
var posts = 'posts';
var testData = require('../seeds/' + posts + '.js');

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

  describe('PATCH', function () {

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

    it('changes title using replace operation', function (done) {
      var id = this.recordId;
      var payload = [{
        op: 'replace',
        path: '/title',
        value: this.changedTitle
      }];
      doWithSession(this.cookie, config, function (cookie) {
        request.patch([serverUrl, posts, id].join('/'))
          .set('Cookie', cookie)
          .send(payload)
          .end(function (res) {
            assert(res.ok, 'patch request responded ok');
            done();
          });
      });
    });
  });
});


function doWithSession(cookie, config, callback) {
  var credentials = config.admin;
  return request.post(serverUrl + '/sessions')
    .send(credentials)
    .end(function (res) {
      assert(res.ok);
      cookie = res.headers['set-cookie'];
      assert(cookie, 'session cookie ok');
      cookie = cookie[0].slice(0, cookie[0].indexOf(';'));

      callback(cookie);
    });
}

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
