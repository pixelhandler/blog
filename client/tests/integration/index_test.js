(function (window) {

module('Index', {
  setup: function () {
    window.showdown = new Showdown.converter();
    route('index').setProperties({'offset': -5, 'loadedIds': []});
    controller('index').get('content').length = 0;
  },
  teardown: function () {
    unload('post');
    App.reset();
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
    equal(find(excerpt).length, 5, 'index page has five (5) post excerpts');

    ok(exists(showMore), 'Show more link exists');
    click(showMore).then(function () {
      equal(find(excerpt).length, 9, 'nine (9) post excerpts shown after click on show more');
    });
  });
});

}(window));
