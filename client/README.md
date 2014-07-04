# Ember App Builder - Client

One repository for end-to-end JavaScript application development using two apps.

This is the toolset for client-side application development.


## Getting Started

* Execute `make install` to fetch dependendies.
* See [ember-cli] for more info

[ember-cli]: http://ember-cli.com


### Static File Server

* Execute `make server` to launch a static file server for the client
  app. Files in the app and vendor directories are watched for
  referching your browser after each change triggers a build.


## Makefile

See [Makefile](Makefile) for tasks

* `make install` - fetch dependencies and setup
* `make build` = Build app using Brunch.io
* `make server` - Starts server for client app
* `make test` - Launch Testem to execute tests, see testem.json


## Build

Use `make build` (default is 'development')

* See [ember-cli]


## Depedencies

* [bower.json](bower.json)
* [package.json](package.json)


### Canary

Use bower.json for canary options, See [ember-cli].

Alternatively, use a shell script [bin/canary.sh](bin/canary.sh) to fetch Ember
Canary and Ember Data Canary (in 'vendor/development/'); also removes copied
vendor file for Ember and Ember Data.


## Testing

1. Start db, see Makefile in server directory
1. Start API server, (see ^), If needed, seed the db first
1. `make test` launches testem and browsers to test in dev


## Code Quality

* [jshint options]

[jshint options]: http://jshint.com/docs/options/


## Links

* [ember-cli]


## Sockets

Emit, with last argument as callback function to receive data.

    beforeModel: function () {
      var socket = this.socket;
      // sanity check, is socket working?
      socket.on('hello', function (data) {
        console.log(data);
        socket.emit('talk-to-me', 'I like talking.', function (msg) {
          console.log('back talk', msg);
        });
      });
    }


## ROADMAP

1. Sync data stores memory -> localStorage -> socket
2. Assist/rescue memory.find w/ strategy: if not in memory, check localStorage and if not there ask socket to find.
3. Finish SocketSource need to handle add (create record), remove (delete record), update (patch record) for admin tasks (may need a replace action too)
4. Add Stats collection and track stats for each post record
5. Add ‘trends’ link in nav to list trending posts (most viewed by month)
6. Sync index of records w/ remote storage via socket to get missing records (receive new resources not in memory or localStorage)
7. Using index chuck load of records for index pages like blog index (home) and archives (this already works on master via REST, but tabled to re-implement after transition to sockets/orbit.js)
8. Add middleware to socket for authenticated message (cookie session) for add, remove, update, patch, replace actions

Note: 2 and 3 above may require work in orbit.js or perhaps a transform method


## Thanks

For providing examples of building with Ember.js:

* [ember-cli]
* [tildeio/bloggr-client]
* [orbitjs/orbit.js]

[tildeio/bloggr-client]: https://github.com/tildeio/bloggr-client
[orbitjs/orbit.js]: https://github.com/orbitjs/orbit.js
