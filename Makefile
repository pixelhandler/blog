lint:
	@jshint app/**/*.js

preflight: clean
	@export PREFLIGHT=true; ember server -e production; unset PREFLIGHT

fastboot: clean
	@ember fastboot --serve-assets

clean:
	@rm -fr ./dist/* ./tmp/*

docs: lint
	@yuidoc ./app/* -c yuidoc.json --server 3333

docfiles: lint
	@yuidoc ./app/* -c yuidoc.json

install: clean
	@rm -rf node_modules bower_components && npm cache clear && bower cache clean && npm install && bower install

.PHONY: install
