import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;

module('Post', {
  setup: function () {
    window.showdown = new Showdown.converter();
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

var testData = window.testData;

var postAttrs = {
  title: '.Blog-content h1',
  author: '.Blog-content .author',
  date: '.Blog-content .date',
  excerpt: '.Blog-content .intro',
  body: '.Blog-content .below-the-fold'
};

test('First Post', function () {
  expect(9);

  visit('/posts').then(function () {
    var postLink = '.Blog-nav .Blog-nav-list:eq(0) .Blog-nav-list-item:eq(0) a';

    visit(hyperlink(postLink)).then(function () {
      for (var attr in postAttrs) {
        if (postAttrs.hasOwnProperty(attr)) {
          ok(exists(postAttrs[attr]), ['1st post', attr, 'element exists'].join(' '));
        }
      }

      var postContent = {
          title: testData[0].title,
          author: testData[0].author.name,
          excerpt: testData[0].excerpt.slice(0, 26),
          body: $(window.showdown.makeHtml(testData[0].body)).text().slice(0, 26)
        },
        selector,
        matching;

      for (var content in postContent) {
        if (postContent.hasOwnProperty(content)) {
          selector = postAttrs[content];
          matching = postContent[content];
          ok(hasText(selector, matching), '1st post has text: ' + matching);
        }
      }
    });
  });
});

test('Second Post', function () {
  expect(9);

  visit('/posts').then(function () {
    var postLink = '.Blog-content .Blog-list-link:eq(1) a';

    click(postLink).then(function () {
      for (var attr in postAttrs) {
        if (postAttrs.hasOwnProperty(attr)) {
          ok(exists(postAttrs[attr]), ['2nd post', attr, 'element exists'].join(' '));
        }
      }

      var postContent = {
          title: testData[1].title,
          author: testData[1].author.name,
          excerpt: testData[1].excerpt.slice(0, 26),
          body: testData[1].body.slice(0, 26)
        },
        selector,
        matching;

      for (var content in postContent) {
        if (postContent.hasOwnProperty(content)) {
          selector = postAttrs[content];
          matching = postContent[content];
          ok(hasText(selector, matching), '2nd post has text: ' + matching);
        }
      }
    });
  });
});
