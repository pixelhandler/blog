#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const importcss = require('postcss-import');
const nestedcss = require('postcss-nested');

const src = 'styles/app.css';
const dest = 'dist/styles.css';

fs.readFile(file(src), (err, css) => {
  postcss([importcss, nestedcss])
    .process(css, { from: src, to: dest })
    .then(result => {
      fs.writeFileSync(file(dest), result.css);
      if ( result.map ) fs.writeFileSync(file(dest + '.map'), result.map);
    });
});

function file(name) {
  return path.resolve(__dirname, '..', name);
}