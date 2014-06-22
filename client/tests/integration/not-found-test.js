import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;

module('Not Found', {
  setup: function () {
    window.showdown = new Showdown.converter();
    App = startApp();
  },
  teardown: function () {
    unload('post');
    Ember.run(App, App.destroy);
  }
});

var heading = '.Blog-content h1';
var link = '.Blog-content p a';
var linkText = 'Archives';
var notFound = 'not-found';

test('Not found page has heading and link to archives', function () {
  expect(4);
  visit('/oops').then(function () {
    ok(exists(heading), 'Not found template has heading.');
    ok(exists(link), 'Not found template has link in body.');
    ok(hasText(link, linkText), 'Not found link has text: ' + linkText);
    equal(currentPath(), notFound, 'Not found route has path: ' + notFound);
  });
});
