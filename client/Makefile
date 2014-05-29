build: lint clean 
	@export BRUNCH_ENV=development; brunch b

clean:
	@rm -fr ./public/*

dist: clean build prod

doc:
	@yuidoc ./app/* -c yuidoc.json --server 3333

docfiles: lint
	@yuidoc ./app/* -c yuidoc.json

install:
	@npm install
	@npm install grunt-blanket-qunit --save-dev
	@bower install
	@bin/patches.sh
	@bin/vendor.sh
	@bin/canary.sh

canary:
	@bin/canary.sh

lint:
	@jshint app/*

prod: lint
	@export BRUNCH_ENV=production; brunch build --production

test: lint
	@testem

coverage: lint
	@open http://localhost:8989/tests/coverage.html?coverage=true
	@python -m SimpleHTTPServer 8989

ci: dist
	@grunt blanket_qunit --verbose

server: lint
	@brunch watch --server
	@open http://localhost:8000/

static_server: lint
	@node -e "require('./server.js').startServer()"
	@open http://localhost:8000/

.PHONY: build clean dist doc docfiles install lint prod test coverage ci server
