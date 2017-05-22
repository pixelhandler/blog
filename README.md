# Pixelhandler-com

Blog (client) application for pixelhandler.com

- Written with [TypeScript][typescript]
- End-to-end tests with [Webdriver.io][webdriver]
- Data source: api.pixelhandler.com JSON API


## Development

*Nginx*

    sudo nginx -c path_to… ./etc/nginx/nginx.conf
    sudo nginx -s stop
    tail -f /usr/local/var/log/nginx/error.log

*Webpack* build with TypeScript

    npm run build
    npm run start


## Styles

*PostCSS* modules

- postcss-cssnext, postcss-import, postcss-nested

*Compile* styles

    ./bin/process-css.js

Or,

    postcss styles/app.css -c ./postcss.config.js -o dist/styles.css


## Testing

See [webdriver] docs.

*Install*

    curl -O http://selenium-release.storage.googleapis.com/3.0/selenium-server-standalone-3.0.1.jar
    curl -L https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-macos.tar.gz | tar xz
    npm install webdriverio
    ./node_modules/.bin/wdio config

Download and install Java SE JDK, `jdk-8u131-macosx-x64.dmg`

*Start Selenium Server*

    cd test
    java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.0.1.jar
    java -jar -Dwebdriver.chrome.driver=./chromedriver selenium-server-standalone-3.0.1.jar

*Run tests*

    ./node_modules/.bin/wdio wdio.conf.js
    npm run test

*Run Webdriver REPL*

    npm run test-repl
    browser.url('https://pixelhandler.com/tags')


## Release

    make build
    make dist

- Upload to S3, set metadata

*Metadata* for JS/CSS Assets

```
Cache-Control
max-age=63072000, public

Content-Encoding
gzip

Content-Type
application/javascript
text/css

Expires
Tue, 01 Jan 2030 00:00:00 GMT
```

*Metadata* for HTML

```
Content-Type
text/html; charset=UTF-8

Cache-Control
max-age=14

Content-Encoding
gzip
```


[typescript]: https://www.typescriptlang.org/
[webdriver]: http://webdriver.io/guide.html
