import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';

var App;

module('Posts/Index', {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

var list = '.Blog-list';
var date = '.Blog-list-date';
var link = '.Blog-list-link a';

test('Posts Index template lists posts (archives)', function () {
  expect(3);
  visit('/posts').then(function () {
    ok(exists(list), 'Index template has list of post(s).');
    ok(exists(date), 'post date exists');
    ok(exists(link), 'post link exists');
  });
});
