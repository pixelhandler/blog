#!/usr/bin/env node

var r = require('rethinkdb'),
  async = require('async');

var settings = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db: process.env.RDB_DB
};

r.connect(settings, function (err, conn) {
  if (err) throw err;

  var name = 'blog';

  async.series([
    // drop blog db
    function (callback) {
      r.dbDrop(name).run(conn, function (err, result) {
        callback();
      });
    },
    // create blog dB
    function (callback) {
      r.dbCreate(name).run(conn, callback);
    },
    // catalogs table, list of collections
    function (callback) {
      r.db(name).tableCreate('catalogs').run(conn, callback);
    },
    // posts table
    function (callback) {
      r.db(name).tableCreate('posts').run(conn, callback);
    }
  ],
  function (err, results) {
    console.log(JSON.stringify(results));
    process.exit();
  });
});
