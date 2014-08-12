# Blog API

## Setup

```rb
rake db:setup
rake db:seed
```

## Start

```rb
rails s
```

## See client application Makefile for starting the client

### orbit.js and ember-orbit dependencies

See <https://github.com/pixelhandler/blog/blob/try-ember-orbit-and-rails-api/client/bower.json#L18-L19>

* Clone the repos in ../local and run `npm install` and `grunt package` in each one
* Edit the bower.json file with the full path to the local builds

### Start the client application

```
cd ../client
make server
```

### Editing

Authentication is disabled, to edit a blog post visit: <http://localhost:4200/admin>

## ISSUES

With content type `application/json-patch+json`

* `format.json_patch` not recognized in controllers
* params object in controller doesn't have JSON Patch document

To reproduce edit a post (patch is sent after exiting a field).

Watch the logger, debugger stops the app in the PostController#update method
