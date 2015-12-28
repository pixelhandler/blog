lint:
	@jshint app/**/*.js

clean:
	@rm -fr ./dist/* ./tmp/*

docs: lint
	@yuidoc ./app/* -c yuidoc.json --server 3333

docfiles: lint
	@yuidoc ./app/* -c yuidoc.json

install:
	@rm -rf node_modules bower_components && npm cache clear && bower cache clean && npm install && bower install

.PHONY: install