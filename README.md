# Blog

* The client-side application for <http://pixelhandler.com>.
* The API server follows the JSON API spec at <http://jsonapi.org>.
* The server application is at <https://github.com/pixelhandler/blog-api>.


## Getting Started

* Execute `make install` to fetch dependendies.
* See [ember-cli] for more info

[ember-cli]: http://ember-cli.com


### Static File Server

Execute `make server` to launch a static file server for the client
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


## Testing

1. Start API server, (see ^), If needed, seed the db first
1. `make test` launches testem and browsers to test in dev


## Code Quality

* [jshint options]

[jshint options]: http://jshint.com/docs/options/


## Links

* [ember-cli]
* [orbitjs/orbit.js]
* [orbitjs/ember-orbit]

[orbitjs/orbit.js]: https://github.com/orbitjs/orbit.js
[orbitjs/ember-orbit]: https://github.com/orbitjs/ember-orbit


## Thanks

For providing tools and examples of building with Ember.js:

* [ember-cli]
* [tildeio/bloggr-client]
* [orbitjs/orbit.js]

[tildeio/bloggr-client]: https://github.com/tildeio/bloggr-client
