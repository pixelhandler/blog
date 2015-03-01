#!/usr/bin/env node

var r = require('rethinkdb');
var async = require('async');

var settings = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db: process.env.RDB_DB
};

r.connect(settings, function (err, conn) {
  if (err) throw err;
  conn.use('blog');

  async.series([

    // index for posts.slug
    function (callback) {
      if (process.argv[2] === '--create') return callback();
      r.table('posts').indexDrop('slug').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },
    function (callback) {
      if (process.argv[2] === '--drop') return callback();
      r.table('posts').indexCreate('slug').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },

    // index for metrics.date
    function (callback) {
      if (process.argv[2] === '--create') return callback();
      r.table('metrics').indexDrop('date').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },
    function (callback) {
      if (process.argv[2] === '--drop') return callback();
      r.table('metrics').indexCreate('date').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },

    // index for metrics.visit
    function (callback) {
      if (process.argv[2] === '--create') return callback();
      r.table('metrics').indexDrop('visit').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },
    function (callback) {
      if (process.argv[2] === '--drop') return callback();
      r.table('metrics').indexCreate('visit').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },

    // index for metrics.visitor
    function (callback) {
      if (process.argv[2] === '--create') return callback();
      r.table('metrics').indexDrop('visitor').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    },
    function (callback) {
      if (process.argv[2] === '--drop') return callback();
      r.table('metrics').indexCreate('visitor').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        callback();
      });
    }

  ],
  function (err, results) {
    if (err) console.error(err);
    process.exit();
  });
});
