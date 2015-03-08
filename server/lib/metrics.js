/**
  @module lib/metrics
  @requires rethinkdb
**/
var r = require('rethinkdb');
var assert = require('assert');
var loginfo = require('debug')('app:info');
var logerror = require('debug')('app:error');

var host = process.env.RDB_HOST || 'localhost';
var port = parseInt(process.env.RDB_PORT) || 28015;
var db = process.env.RDB_DB || 'blog';

/**
  Impressions Query - accepts params:
  ```
  {
    seconds: 86400,
    sortBy: "pathname",
    limit: 1000,
    offset: 0,
    order: "desc"
  }
  ```
  @method impressions
  @param {Object} query
  @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  @async
**/
module.exports.impressions = function (query, callback) {
  query.seconds = parseInt(query.seconds, 10) || 86400;

  r.connect({ host: host, port: port }, function (err, connection) {
    assert.ok(err === null, err);
    //connection._id = Math.floor(Math.random() * 10001);
    //loginfo('connection._id', connection._id);
    r.db(db).table('metrics')
    .filter(function(metric) {
      return r.ISO8601(metric('date')).during(
        r.epochTime( r.now().toEpochTime().sub(query.seconds) ),
        r.now()
      );
    })
    .filter('page_view')
    .withFields('pathname')
    .group('pathname')
    .count()
    .ungroup()
    .map(function (doc) {
      return doc.merge({
        pathname: doc('group').split('/').slice(1),
        impressions: doc('reduction')
      }).without('group','reduction');
    })
    .run(connection, function (err, payload) {
      if (err) {
        logerror('impressions', err);
      }
      callback(err, payload);
    });

  });
};

/**
  Duration Query - group X_view metrics by pathname and average the duration,
  `name` param options: application_view index_view post_view about_view archive_view
  searchable params: blogVersion emberVersion userAgent pathname

  For example:

  * http://localhost:8888/metrics/durations?name=post_view&emberVersion=1.10
  * http://localhost:8888/metrics/durations?name=post_view&emberVersion=1.8&userAgent=iPhone
  * http://localhost:8888/metrics/durations?name=post_view&emberVersion=1.10&userAgent=Gecko&pathname=component

  @method durations
  @param {Object} query - default `name` param is 'application_view'
  @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  @async
**/
module.exports.durations = function (query, callback) {
  query.seconds = parseInt(query.seconds, 10) || 86400 * 365;

  r.connect({ host: host, port: port }, function (err, connection) {
    assert.ok(err === null, err);

    // params for post, index, archive, about
    var nameParams = 'application_view index_view post_view about_view archive_view find_posts metrics_table find_metrics'.split(' ');
    var nameParam = query.name || '';
    if (nameParams.indexOf(nameParam) === -1) {
      nameParam = 'application_view';
    }
    var criteria = r.db(db).table('metrics')
    .filter(function(metric) {
      return metric('name').match(nameParam);
    })
    .filter(function(metric) {
      return r.ISO8601(metric('date')).during(
        r.epochTime( r.now().toEpochTime().sub(query.seconds) ),
        r.now()
      );
    });
    var searchParams = 'blogVersion emberVersion userAgent pathname'.split(' ');
    var addSearchCriteria = function(criteria, prop, value) {
      var _prop = prop, _value = value;
      return criteria.filter(function(metric) {
        return metric(_prop).match(_value);
      });
    };
    for (var prop in query) {
      if (query.hasOwnProperty(prop) && searchParams.indexOf(prop) !== -1) {
        criteria = addSearchCriteria(criteria, prop, query[prop]);
      }
    }
    criteria = criteria.group('pathname').ungroup()
    .map(function(doc) {
      return doc.merge({
        pathname: doc('group'),
        fastest: doc('reduction').min('duration')('duration'),
        slowest: doc('reduction').max('duration')('duration'),
        durations: doc('reduction').count()
      }).without('group','reduction');
    })
    .limit(query.limit)
    .run(connection, function (err, payload) {
      if (err) {
        logerror('duration', err);
      }
      callback(err, payload);
    });

  });
};


/*
  Query for the Geometric Mean of a Normalized set of metrics

  Filters the metrics by platform, browser, metric name e.g. 'index_view', and emberVersion; returns JSON -

  ```javascript
  {
    "name":  "index_view",
    "geometric_mean": 187.945,
    "  fast": 65.41,
    "slow": 9547.233
  }
  ```

  @method mean
  @param {Object} query - `name`, `platform`, `browser`, `emberVersion`
  @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  @async
*/
module.exports.mean = function (query, callback) {
  var emberVersion = query.emberVersion || '1.10';
  var name = query.name || 'index_view';
  var platforms = ['Macintosh','Windows'];
  var platform = (query.platform && platforms.indexOf(query.platform) !== -1) ? query.platform : platforms[0];
  var browser = query.browser || 'Chrome';
  var userAgentSearchFn = "(function(row) { return row.userAgent.search(" + {
    'Chrome': "/^.*("+ platform +")(?!.*(Chromium|Mobile)).*(Chrome)/",
    'Firefox': "/^.*("+ platform +")(?!.*Seamonkey).*(Firefox)/",
    'Safari': "/^.*("+ platform +")(?!.*(Chrome|Chromium|Mobile)).*(Safari)/",
    'iPad': "/^.*(iPad)/",
    'iPhone': "/^.*(iPhone)/",
    'Android': "/^.*(Android)/",
  }[browser] + ") != -1; })";
  var limit = 100;
  var convert = function(doc) {
    return {
      name: doc.name,
      fast: doc.fastest,
      slow: doc.slowest,
      measurments: doc.durations.length,
      geometric_mean: Math.round(
        Math.pow(
          doc.durations.reduce( function (a,b) {return a*b;} ),
          1/doc.durations.length
        ) * 1000
      ) / 1000,
      durations: doc.durations,
      userAgents: doc.userAgents,
      metrics: doc.metrics
    };
  };
  var convertExpression = '(' + convert.toString() + ')';

  r.connect({ host: host, port: port }, function (err, connection) {
    assert.ok(err === null, err);

    r.db('blog').table('metrics').orderBy({index: r.desc('date')})
      .withFields('duration','name','emberVersion','userAgent','date','id','pathname')
      .filter(function(metric) {
        return metric('emberVersion').match(emberVersion);
      })
      .filter(function(metric) {
        return metric('name').match(name);
      })
      .filter(r.js(userAgentSearchFn))
      .group('name').ungroup()
      .map(function(doc) {
        return doc.merge({
          name: doc('group'),
          durations: doc('reduction').map(function(metric) {
            return metric.pluck('duration')('duration');
          }).limit(limit),
          fastest: doc('reduction').min('duration')('duration'),
          slowest: doc('reduction').max('duration')('duration'),
          userAgents: doc('reduction').map(function(metric) {
            return metric.pluck('userAgent')('userAgent');
          }).distinct(),
          metrics: doc('reduction').map(function(metric) {
            return metric.pluck('duration','date','id','emberVersion','pathname');
          }).limit(limit)
        }).without('group','reduction');
      })
      .map(r.js(convertExpression))
      .run(connection, function (err, payload) {
        if (err) {
          logerror('mean', err);
        }
        payload = payload[0] || {};
        payload.emberVersion = emberVersion;
        payload.platform = (['iPad','iPhone','Android'].indexOf(browser) == -1) ? platform : null;
        payload.browser = browser;
        callback(err, { 'metric': payload });
      });
  });
};

/**
  Exports {Function} metric.findQuery method

  Example Metric resource:
  ```
    {
      adapterType: "SOCKET",
      blogVersion: "3.3.8.fa3fbaf8",
      date: "2015-02-08T06:29:17.368Z",
      duration: 113.35,
      emberVersion: "1.10.0",
      id: "1a9864a2-4011-49d8-9233-fa76d26e9040",
      name: "post_view",
      pathname: "/posts/refreshed-my-blog-with-express-and-emberjs",
      screenColorDepth: 24,
      screenHeight: 900,
      screenOrientation: "landscape-primary",
      screenPixelDepth: 24,
      screenWidth: 1440,
      startTime: 391,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36",
      visit: "22d5d2b0be4067ac3af57f4b14fcbb4b4d89fe34b1eeeaab910c259e7b9c55aa",
      visitor: "c56f439e-646b-4f6a-b91b-5c119e21efba"
    }
  ```

  @method findQuery
  @param {String} type
  @param {Object} query
  @param {Function} callback that accepts arguments: {Error} err, {Object} (JSON) result
  @async
**/
module.exports.findQuery = function findQuery(type, query, callback) {
  query.seconds = parseInt(query.seconds, 10) || 60 * 60 * 24 * 120;
  var metaPartial = metaFactory(query);
  var _callback = callback;

  r.connect({ host: host, port: port }, function (err, connection) {
    assert.ok(err === null, err);
    if (err) { logerror(err); }
    var collection = r.db(db).table(type).filter(function(metric) {
      return r.ISO8601(metric('date')).during(
        r.epochTime( r.now().toEpochTime().sub(query.seconds) ),
        r.now()
      );
    });
    collection.count().run(connection, function (err, results) {
      if (err) { logerror(err); }
      var meta = metaPartial(results);
      var criteria;
      if (query.sortBy === 'date') {
        criteria = r.db(db).table(type).orderBy({index: r[query.order](query.sortBy)}).skip(query.offset).limit(query.limit);
      } else {
        criteria = collection.orderBy(r[query.order](query.sortBy)).skip(query.offset).limit(query.limit);
      }
      if (query.withFields) {
        var fields = query.withFields.split(',');
        criteria = criteria.withFields.apply(criteria, fields);
      }
      var nonSearchableParams = 'limit offset sortBy order withFields'.split(' ');
      var searchParams = 'adapterType blogVersion emberVersion name userAgent pathname'.split(' ');
      var addSearchCriteria = function(criteria, prop, value) {
        var _prop = prop, _value = value;
        return criteria.filter(function(metric) {
          return metric(_prop).match(_value);
        });
      };
      for (var prop in query) {
        if (nonSearchableParams.indexOf(prop) !== -1) { continue; }
        if (query.hasOwnProperty(prop) && searchParams.indexOf(prop) !== -1) {
          criteria = addSearchCriteria(criteria, prop, query[prop]);
        }
      }
      if (query.hasOwnProperty('groupBy') && nonSearchableParams.indexOf(query.groupBy) === -1) {
        criteria = criteria.group(query.groupBy);
        // groupBy may also be used together with count
        if (query.hasOwnProperty('count') && query.count === 'true') {
          criteria = criteria.count();
        }
        criteria = criteria.ungroup();
      }
      criteria.run(connection, function (err, cursor) {
        if (err) {
          findError(err, _callback);
        } else {
          findQuerySuccess(type, cursor, meta, _callback);
        }
        connection.close();
      });
    });
  });
};

/**
  Meta factory - create {Object) `meta` data, returned w/ find responses
  partial application, returns `meta` function which needs the count
  @method buildMeta
  @param {Object} query
  @return {Function} meta that accepts param for total (count of query result)
**/
function metaFactory(query) {
  var _query = queryFactory(query);
  /**
    @method meta
    @param {Number} total
    @return {object} - with properties: `limit`, `sort`, `sortBy`, `order`, `total`
  **/
  var meta = function (total) {
    _query.total = total;
    return _query;
  };
  return meta;
}

/**
  @method queryFactory
  @param {Object} query
  @return {Object} query - with defaults and number strings converted
**/
function queryFactory(query) {
  query.limit = (query.limit)? parseInt(query.limit, 10) : 10;
  query.offset = (query.offset)? parseInt(query.offset, 10) : 0;
  query.sortBy = query.sortBy || 'date';
  query.order = query.order || 'desc';
  return query;
}

/**
  Async success / error handlers
**/
function findError(err, callback) {
  var msg = "[ERROR][%s][metrics.findQuery] %s:%s\n%s";
  logerror(msg, err.name, err.msg, err.message);
  callback(err, null);
}

function findQuerySuccess(type, cursor, meta, callback) {
  cursor.toArray(function(err, results) {
    results = transform(results);
    var msg;
    if (err) {
      msg = "[ERROR][%s][metrics.findQuery][toArray] %s:%s\n%s";
      logerror(msg, err.name, err.msg, err.message);
      callback(err, null);
    } else {
      var payload = { meta: meta };
      payload[type] = results;
      //msg = "Success metrics.findQuery %s";
      //loginfo(msg, type);
      callback(null, payload);
    }
  });
}

function transform(results) {
  var payload = [];
  for (var i = 0; i < results.length; i++) {
    payload.push(transformDate(results[i]));
  }
  return payload;
}

function transformDate(payload) {
  if (payload.date) {
    if (typeof payload.date.toISOString == 'function') {
      if (!payload.timestamp) {
        payload.timestamp = payload.date;
      }
      payload.date = payload.date.toISOString();
    }
  }
  return payload;
}
