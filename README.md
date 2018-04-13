# Pixelhandler-com

Blog (client) application for pixelhandler.com

- Written with [TypeScript][typescript]
- End-to-end tests with [Webdriver.io][webdriver]
- Data source: api.pixelhandler.com JSON API


## Development

*Build* Webpack with TypeScript

Pick one:

    make
    make build
    make watch

*Server* with Node

    make server

Or, use *Nginx*

    sudo nginx -c path_to… ./etc/nginx/nginx.conf
    sudo nginx -s stop
    tail -f /usr/local/var/log/nginx/error.log


## Styles

*PostCSS* modules

- postcss-cssnext, postcss-import, postcss-nested
../src/fibers.cc:1:
/home/billheat/.node-gyp/8.9.1/include/node/v8.h
*Compile* styles, runs in `make build`

    ./bin/process-css.js

Or,

    postcss styles/app.css -c ./postcss.config.js -o dist/styles.css


## Testing

See [webdriver] docs.

- Requires Java, on ubuntu use `sudo apt-get install default-jre`, or
  see https://java.com/en/download/

*Install* Selenium server 

- https://github.com/vvo/selenium-standalone#selenium-standalone---

    npm install selenium-standalone@latest -g
    selenium-standalone install

*Start Selenium Server*

    selenium-standalone start

*Run tests*

    make test

*Run Webdriver REPL*

    make test-repl
    browser.url('https://pixelhandler.com/tags')

For Ubuntu Desktop may need node-gyp and fibers

    npm install -g fibers
    npm install -g node-gyp

For Ubuntu (e.g. WSL) may need to run headless

    sudo apt-get install firefox

    sudo apt-get -y install xvfb gtk2-engines-pixbuf
    sudo apt-get -y install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable

    Xvfb -ac :99 -screen 0 1280x1024x16 &
    export DISPLAY=:99


## Release

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
