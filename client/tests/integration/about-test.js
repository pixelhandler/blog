import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;

module('About', {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

test('Route /about', function () {
  expect(1);
  visit('/about').then(function () {
    equal(currentPath(), 'about', '/about route works.');
  });
});

var about = '.Blog-about';

test('About template', function () {
  expect(4);
  visit('/about').then(function () {
    ok(exists(about), 'About template text exists.');
    ok(hasText(about, 'pixelhandler'), '"pixelhandler" text present');
    ok(hasText(about, 'Bill Heaton'), '"Bill Heaton" text present');
    ok(hasText(about, '1-714-512-2215'), '"1-714-512-2215" text present');
  });
});
