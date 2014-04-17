(function (window) {

module('About', {
  //setup: function () {},
  teardown: function () {
    unload('post');
    App.reset();
  }
});

test('Route /about', function () {
  expect(1);
  visit('/about').then(function () {
    equal(path(), 'about', '/about route works.');
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

}(window));
