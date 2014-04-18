#!/usr/bin/env node

var fs = require('fs');

// Add missing main property to showdown bower.json
updateFileContent('./bower_components/showdown/.bower.json', null, [
  {
    matcher: /name/,
    replacers: [
      function (line) {
        return line + '\n  "main": "src/showdown.js",';
      }
    ]
  }
]);

// Add missing main property to socket.io client bower.json
updateFileContent('./bower_components/socket.io-client/.bower.json', null, [
  {
    matcher: /name/,
    replacers: [
      function (line) {
        return line + '\n  "main": "dist/socket.io.js",';
      }
    ]
  }
]);

// Read file, update, write
function updateFileContent(read, write, callbacks) {
  var file = fs.readFileSync(read, 'utf8');
  if (!write) {
    write = read;
  }
  console.log('Patch:', write);
  var revised = replaceInline(file, null, callbacks).trim();
  fs.writeFileSync(write, revised, 'utf8');
}

// Search and replace inline
function replaceInline(string, regex, callbacks) {
  var lines = [], text = '', revised = '';
  var fns, fn, i, j, k;

  if (!regex || typeof regex.constructor.prototype.test !== 'function') {
    regex = /\r?\n/;
  }
  lines = string.split(regex);
  for (i = 0; i < lines.length; i++) {
    text = lines[i];
    for (j = 0; j < callbacks.length; j++) {
      if (text.search(callbacks[j].matcher) !== -1) {
        fns = callbacks[j].replacers;
        for (k = 0; k < fns.length; k++) {
          fn = fns[k];
          text = fn(text);
          console.log('Replaced:', text, '\n');
        }
      }
    }
    revised += text + '\n';
  }
  return revised;
}
