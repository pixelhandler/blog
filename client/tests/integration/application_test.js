(function (window) {

module('Application', {
  setup: function () {
    window.showdown = new Showdown.converter();
    window.sessionStorage.removeItem('admin_key');
    route('posts.index').setProperties({'offset': -20, 'loadedIds': []});
    controller('postsIndex').get('content').length = 0;
  },
  teardown: function () {
    unload('post');
    App.reset();
  }
});

test('Application has a list of posts', function () {
  expect(6);
  visit('/posts').then(function () {
    testRecentPosts();
    testLinks();
  });
});

test('Posts page still shows nav list of posts', function () {
  expect(6);
  visit('/posts').then(function () {
    testRecentPosts();
    testLinks();
  });
});

test('About page still shows nav list of posts', function () {
  expect(6);
  visit('/about').then(function () {
    testRecentPosts();
    testLinks();
  });
});

test('Post detail page still shows list of posts', function () {
  expect(6);
  visit('/posts').then(function () {
    var postLink = '.Blog-nav-list:eq(0) .Blog-nav-list-item:eq(1) a';

    click(postLink).then(function () {
      testRecentPosts();
      testLinks();
    });
  });
});

var testData = window.testData;

function testRecentPosts() {
  var list = '.Blog-nav .Blog-nav-list:eq(0)';
  var heading = '.Blog-nav h4:eq(0)';
  var links = list + ' .Blog-nav-list-item a';
  equal(text(heading), 'Recent Posts', 'Posts heading present');
  equal(find(links).length, testData.length, testData.length + ' posts listed');
  equal(text(links + ':eq(0)'), testData[0].title, '1st post title and author listed');
  equal(text(links + ':eq(1)'), testData[1].title, '2nd post title and author listed');
}

function testLinks() {
  var list = '.Blog-nav .Blog-nav-list:eq(1)';
  var heading = '.Blog-nav h4:eq(1)';
  var links = list + ' .Blog-nav-list-item a';
  equal(text(heading), 'Links', 'Links heading present');
  equal(find(links).length, 3, 'Three links listed');
}

}(window));
