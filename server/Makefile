install: config brew
	@npm install

config:
	@bin/config.sh

brew:
	@./bin/install_rethinkdb.sh

db:
	@rethinkdb

setup:
	@./bin/create_blog_db.js

seed: setup
	@./bin/seed_blog_db.js

lint:
	@./node_modules/.bin/jshint lib/* app.js tests/*

test: lint seed
	@./node_modules/.bin/mocha --reporter spec tests/*

server:
	@DEBUG=* node app.js

.PHONY: config install db lint test server
