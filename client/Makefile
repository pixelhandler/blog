server:
	@export BROCCOLI_ENV=development; ./node_modules/.bin/ember server --environment=development
	@open http://localhost:4200/

server_proxy: lint
	@./node_modules/.bin/ember server --proxy http://pixelhandler.com/api

install:
	@rm -rf node_modules bower_components tmp dist
	@ember install
	@npm install
	@./node_modules/.bin/ember init

canary:
	@bin/canary.sh

build: lint clean
	@export BROCCOLI_ENV=development; ./node_modules/.bin/ember build --environment=development

prod: lint clean
	@export BROCCOLI_ENV=production; ./node_modules/.bin/ember build --environment=production

lint:
	@jshint app/**/*.js

clean:
	@rm -fr ./dist/* ./tmp/*

dist: prod

dist_server: lint
	@node -e "require('./dist-server.js').startServer()"
	@open http://localhost:8000/

fingerprint:
	@bin/fingerprint.sh --use-cdn

doc:
	@yuidoc ./app/* -c yuidoc.json --server 3333

docfiles: lint
	@yuidoc ./app/* -c yuidoc.json

test: lint
	@./node_modules/.bin/ember test

.PHONY: server install canary build lint clean dist dist_server fingerprint doc docfiles test
