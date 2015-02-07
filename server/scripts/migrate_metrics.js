/*

execute with command:

    RDB_HOST='localhost'; RDB_PORT=28015; RDB_DB='blog'; node ./bin/migrate_metrics.js

Converts...

    {
      "date": "2015-02-07T05:07:54.730Z",
      "duration": 140.86,
      "id": "6008ab5d-e75f-4594-890b-3605a7f27051",
      "name": "post_view",
      "pathname": "/posts/develop-a-restful-api-using-nodejs-with-express-and-mongoose",
      "remoteAddress": "204.9.220.50",
      "screen": {
        "colorDepth": 24,
        "height": 900,
        "orientation": "landscape-primary",
        "pixelDepth": 24,
        "width": 1440
      },
      "startTime": 2184,
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36",
      "versions": {
        "adapter": "SOCKET",
        "blog": "3.3.7.ccc22341",
        "ember": "1.8.1"
      }
    }

To...

    {
      "adapterType":  "SOCKET" ,
      "blogVersion":  "3.3.7.ccc22341" ,
      "date":  "2015-02-07T05:07:54.730Z" ,
      "duration": 140.86 ,
      "emberVersion":  "1.8.1" ,
      "id":  "6008ab5d-e75f-4594-890b-3605a7f27051" ,
      "name":  "post_view" ,
      "pathname":  "/posts/develop-a-restful-api-using-nodejs-with-express-and-mongoose" ,
      "remoteAddress":  "204.9.220.50" ,
      "screenColorDepth": 24 ,
      "screenHeight": 900 ,
      "screenOrientation":  "landscape-primary" ,
      "screenPixelDepth": 24 ,
      "screenWidth": 1440 ,
      "startTime": 2184 ,
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36"
    }

*/

var r = require('rethinkdb');
var assert = require('assert');
var host = process.env.RDB_HOST || 'localhost';
var port = parseInt(process.env.RDB_PORT) || 28015;
var db = process.env.RDB_DB || 'blog';
var settings = { host: host, port: port };

console.log('migration:metrics, flatten versions, screens');

(function migration(r, assert, settings) {
  console.log('connect', settings);
  r.connect(settings, function (err, connection) {
    assert.ok(err === null, err);

    r.db('blog')
    .table('metrics')
    .orderBy(r.desc('date'))
    //.limit(1)
    .replace(function(metric) {
      return metric.merge({
        emberVersion: metric('versions')('ember'),
        blogVersion: metric('versions')('blog'),
        adapterType: metric('versions')('adapter'),
        screenColorDepth: metric('screen')('colorDepth'),
        screenHeight: metric('screen')('height'),
        screenOrientation: metric('screen')('orientation'),
        screenPixelDepth: metric('screen')('pixelDepth'),
        screenWidth: metric('screen')('width')
      }).without('versions', 'screen');
    })
    .run(connection, function(err, result) {
      console.log('run results');
      if (err) {
        console.error(err);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
      connection.close(function(error) {
        if (error) {
          console.error(error);
        }
      });
    });

  });
}(r, assert, settings));
