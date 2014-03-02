(function (window) {

module('Posts', {
  //setup: function () {},
  teardown: function () {
    unload('post');
    App.reset();
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

}(window));
