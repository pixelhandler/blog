server: lint
	@ember server
	@open http://localhost:4200/

install:
	@npm install
	@bower install
	@bin/canary.sh

canary:
	@bin/canary.sh

build: lint clean
	@export BROCCOLI_ENV=development; ember build --environment=development

prod: lint clean
	@export BROCCOLI_ENV=production; ember build --environment=production

lint:
	@jshint app/**/*.js

clean:
	@rm -fr ./dist/*

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
	@ember test

.PHONY: server install canary build lint clean dist dist_server fingerprint doc docfiles test
