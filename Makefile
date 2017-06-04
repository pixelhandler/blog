build: clean
	mkdir -p ./dist
	cp ./public/* ./dist/
	./node_modules/.bin/webpack
	node ./bin/process-css.js

clean:
	rm -fr ./dist/*

install:
	yarn install

watch: build
	./node_modules/.bin/webpack --config webpack.config.js --progress --watch

server:
	node main.js

dist: build
	./bin/dist.sh --use-cdn --gzip

selenium:
	java -jar -Dwebdriver.gecko.driver=./test/geckodriver ./test/selenium-server-standalone-3.0.1.jar

test:
	./node_modules/.bin/wdio wdio.conf.js

test-repl:
	./node_modules/.bin/wdio repl

.PHONY: dist test test-repl
