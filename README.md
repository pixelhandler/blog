# Pixelhandler's Blog

Build on top of https://github.com/pixelhandler/ember-app-builder

* [Pixelhandler.com](http://pixelhandler.com)
* (Local) server runs on port 8888, client on 8000 (using CORS)

## Directories

### [client](client)

* See: [client/README.md](client/README.md), [client/package.json](client/package.json),  [client/bower.json](client/bower.json)

### [server](server)

* See: [server/README.md](server/README.md), [server/package.json](server/package.json)

## Setup

* `cd client && npm install && bower install`
* `cd server && npm install`

## Tasks / Commands

### Client-side

* See [client/Makefile](client/Makefile)

`cd client`, then watch, build and reload using `make server`

### Server-side

* See the [server/Makefile](server/Makefile)

`cd server`, `make db`, `make server`

