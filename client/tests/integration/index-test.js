import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;

module('Index', {
  setup: function () {
    window.showdown = new Showdown.converter();
    App = startApp();
    controller('index').get('content').length = 0;
  },
  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

var excerpt = '.Blog-content .Blog-excerpt';
var showMore = '.Blog-content .Blog-showMore';

test('Index template, lists posts with link to show more', function () {
  expect(8);
  visit('/').then(function () {
    ok(exists(excerpt), 'Index template has excerpt(s).');
    ok(exists(excerpt + ' .Blog-excerpt-title'), 'excerpt title exists');
    ok(exists(excerpt + ' .Blog-excerpt-title a'), 'excerpt title has anchor');
    ok(exists(excerpt + ' .Blog-excerpt-summary'), 'excerpt summary exists');
    ok(exists(excerpt + ' .u-button'), 'excerpt button exists');
    equal(find(excerpt).length, 10, 'index page has five (10) post excerpts');

    ok(exists(showMore), 'Show more link exists');
    click(showMore).then(function () {
      equal(find(excerpt).length, 15, 'fifteen (15) post excerpts shown after click on show more');
    });
  });
});
