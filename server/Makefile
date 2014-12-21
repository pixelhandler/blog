install: brew
	@npm install
	@./bin/config.sh

brew:
	@./bin/install_rethinkdb.sh

db:
	@rethinkdb

setup:
	@./bin/create_blog_db.js

seed: setup
	@./bin/seed_blog_db.js

lint:
	@jshint lib/* app.js tests/*

test: lint seed
	@./node_modules/.bin/mocha --reporter spec tests/*

server:
	@DEBUG=app:info,app:error,rdb:info,rdb:error,socket:info,socket:error node app.js

server_verbose:
	@DEBUG=* node app.js

server_debug:
	@node debug app.js

.PHONY: install db lint test server
