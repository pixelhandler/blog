# Ember App Builder - Server

One repository for end-to-end JavaScript application development using two apps.

This is the toolset for server-side application development.


## Getting Started

* See [package.json](package.json])
* Execute `make install` to fetch dependendies.
* Commands to start up: `make db` and `make server`


## Makefile

* See the [Makefile](Makefile)
* Has commands to launch db, server and execute tests


## Directories

* [bin](bin) - shell scripts (bash or js)
* [lib](lib) - has socket adapter for db
* [routes](routes) - Map HTTP verbs to resoures
* [tests](tests) - has mocha test files


## Environment

* Copy [env-example.json](env-example.json) to `env.json` and edit per env needs.


## Database

Using [RethinkDB] with JavaScript [driver].

1. Install rethink and driver
1. Use `make db` to launch the database

A directory will be created `rethinkdb_data` for your database files

### Seed the data

* In the [bin](bin) directory are files to seed the database
  * Execute `make seed` to drop db, create tables and seed the db

[RethinkDB]: http://www.rethinkdb.com
[driver]: http://www.rethinkdb.com/api/javascript/

## Metrics API Endpoints

Metrics names that are reported: `app_ready`, `application_view`, `index_view`,
`post_view`, `page_view`, `app_unload`, `archive_view`, `find_posts`

* http://pixelhandler.com/api/metrics?withFields=name&groupBy=name&count=true

_Paramaters:_

* Pagination: `limit=`, `offset=`, `sortBy=`, `order=`, `withFields=`
* Date Ranch: `seconds` (prior to now)

### GET /metrics/impressions

Search for blog posts impressions in the last day:

* http://pixelhandler.com/api/metrics/impressions?seconds=86400

### GET /metrics/durations

Search for group '*_view' metrics by pathname and average the duration (ms).

The `name` param options are `application_view`, `index_view`, `post_view`,
`about_view`, `archive_view`

And searchable params are `blogVersion`, `emberVersion`, `userAgent`, `pathname`

For example:

* http://pixelhandler.com/api/metrics/durations?name=post_view&emberVersion=1.10
* http://pixelhandler.com/api/metrics/durations?name=post_view&emberVersion=1.8&userAgent=iPhone
* http://pixelhandler.com/api/metrics/durations?name=post_view&emberVersion=1.10&userAgent=Gecko&pathname=component


### GET /metrics

_Additional Parameters:_

* Searchable (RegExp): `adapterType=`, `blogVersion=`, `emberVersion=`, `name=`, `userAgent=`, `pathname=`
* Grouping/counting: `groupBy` and optional `count`

_Example Queries:_

Search last week of metrics for `post_view` with "ember" in the url (slug) and group by
  `userAgent`

* http://pixelhandler.com/api/metrics?name=post_view&pathname=ember&groupBy=userAgent&seconds=604800

Search for application ready metrids on an iPhone/iPad and group by emberVersion:

* http://pixelhandler.com/api/metrics?sortBy=date&order=desc&name=app_ready&userAgent=iPhone&groupBy=emberVersion&seconds=604800
* http://pixelhandler.com/api/metrics?sortBy=date&order=desc&name=app_ready&userAgent=iPad&groupBy=emberVersion&seconds=604800

Summary of the metrics collection in the last week:

* http://pixelhandler.com/api/metrics?withFields=name&groupBy=name&count=true

Index view performance metrics grouped by userAgent

* http://pixelhandler.com/api/metrics?name=index_view&groupBy=userAgent

Search for repeat visitors in the last day (the number of objects in the `metrics`
array is the value of the uniques)

* http://pixelhandler.com/api/metrics?seconds=86400&name=app_ready&groupBy=visitor&count=true

Get Ember version metrics for the "ember components" article and group by userAgent
(last 4 weeks). Get results for Ember 1.8.1 (w/ Handlebars) v1.3.0 or Ember 1.10.0 (w/ HTMLBars)

1. http://pixelhandler.com/api/metrics?name=post_view&pathname=embercomponents&seconds=2419200&emberVersion=1.8&groupBy=userAgent
2. http://pixelhandler.com/api/metrics?name=post_view&pathname=embercomponents&seconds=2419200&emberVersion=1.10&groupBy=userAgent

Get Metrics for ember beta version (last 4 weeks)

* http://pixelhandler.com/api/metrics?seconds=2419200&emberVersion=beta

Get the durations (ms) for rendering the popular 'restful api post'

* http://pixelhandler.com/api/metrics?name=post_view&pathname=develop-a-restful-api&seconds=2419200&emberVersion=1.8&groupBy=duration&count=true
* http://pixelhandler.com/api/metrics?name=post_view&pathname=develop-a-restful-api&seconds=2419200&emberVersion=1.10&groupBy=duration&count=true

(And boom there it is, version 10 with HTMLbars has quicker load times)




## Testing

1. Launch the database with `make db`
1. Execute the test suite with `make test`
   - The server cannot run on the same port when executing the specs

Uses Mocha with supertest to test API endpoints.

### Client testing

The client test suite, needs the database seeded and API server running
as it is configured as an integration testing suite.

## Roadmap

1. Finish Db Adapter
1. Create Model using Schema
1. Create Controller that binds db adapter to model instance and pass to
   view for output
1. View only yields JSON
1. Routes pass work to Controller
