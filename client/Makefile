build: lint clean 
	@./node_modules/.bin/brunch b

clean:
	@rm -fr ./public/*

dist: clean build prod

doc:
	@./node_modules/.bin/yuidoc ./app/* -c yuidoc.json --server 3333

docfiles: lint
	@./node_modules/.bin/yuidoc ./app/* -c yuidoc.json

install: config
	@npm install
	@npm install grunt-blanket-qunit --save-dev
	@bower install
	@bin/patches.sh
	@bin/vendor.sh
	@bin/canary.sh

config:
	@bin/config.sh

canary:
	@bin/canary.sh

lint:
	@./node_modules/.bin/jshint app/*

prod: lint
	@./node_modules/.bin/brunch build --production

test: lint
	@./node_modules/.bin/testem

coverage: lint
	@open http://localhost:8989/tests/coverage.html?coverage=true
	@python -m SimpleHTTPServer 8989

ci: dist
	@./node_modules/.bin/grunt blanket_qunit --verbose

server: lint
	@./node_modules/.bin/brunch watch --server
	@open http://localhost:8000/

.PHONY: build clean dist doc docfiles config install lint prod test coverage ci server
