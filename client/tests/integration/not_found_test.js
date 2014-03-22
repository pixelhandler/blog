(function (window) {

module('Not Found', {
  setup: function () {
    window.showdown = new Showdown.converter();
  },
  teardown: function () {
    unload('post');
    App.reset();
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
    equal(path(), notFound, 'Not found route has path: ' + notFound);
  });
});

}(window));
