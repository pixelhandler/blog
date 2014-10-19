# Local development/build dependencies

## Install
	
	cd ./orbit.js
	npm install
	cd ../ember-orbit
	npm install

## Build

	cd ./orbit.js
	grunt package
	cd ../ember-orbit
	grunt package

## Config

Edit bower.json file in client directory

    "orbit.js": "/Users/username/pathtorepo/blog/local/orbit.js/dist/",
    "ember-orbit": "/Users/username/pathtorepo/blog/local/ember-orbit/dist/",
