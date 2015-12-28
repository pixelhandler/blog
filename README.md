# Blog

* The client-side application for <http://pixelhandler.com>.
* The API server follows the JSON API spec at <http://jsonapi.org>.
* The server application is at <https://github.com/pixelhandler/blog-api>.


## Getting Started

* Execute `make install` to fetch dependendies.
* See [ember-cli] for more info

[ember-cli]: http://ember-cli.com


### Static File Server

Execute `ember server` to launch a static file server for the client
app. Files in the app and vendor directories are watched for
referching your browser after each change triggers a build.


## Makefile

See [Makefile](Makefile) for tasks

* `make install` - clear out modules, fetch dependencies and setup

## Build

Use `ember build` (default is 'development')

* See [ember-cli]


## Depedencies

* [bower.json](bower.json)
* [package.json](package.json)


## Testing

1. Start API server, (see ^), If needed, seed the db first
1. `ember test -s` launches testem and browsers to test in dev


## Code Quality

* [jshint options]

[jshint options]: http://jshint.com/docs/options/


## Links

* [ember-cli]
