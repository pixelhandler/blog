(function (window) {

var enableAdmin = '.u-enableAdmin';
var disableAdmin = '.u-disableAdmin';
var footerInputs = {
  username: '.Footer input[name="username"]',
  password: '.Footer input[name="password"]'
};
var login = '.Footer .u-login';
var logout = 'Footer .u-logout';

module('Admin Create/Delete', {
  setup: function () {
    window.showdown = new Showdown.converter();
    stop();
    visit('/').then(function () {
      click(enableAdmin).then(function () {
        fillIn(footerInputs.username, 'admin').then(function () {
          fillIn(footerInputs.password, 'admin').then(function () {
            click(login).then(function () {
              start();
            });
          });
        });
      });
    });
  },
  teardown: function () {
    stop();
    visit('/').then(function () {
      click(logout).then(function () {
        start();
        unload('post');
        App.reset();
      });
    });
  }
});

var createPost = 'a[href="/admin/create"]';

test('Menu has link to create a new post', function () {
  expect(1);
  visit(hyperlink(createPost)).then(function () {
    equal(path(), 'admin.create', 'links to Admin page to create a post');
  });
});

var inputs = {
  title: '.Admin-form-title input[name="title"]',
  slug: '.Admin-form-slug input[name="slug"]',
  date: '.Admin-form-date input[name="date"]',
  excerpt: '.Admin-form-excerpt textarea[name="excerpt"]',
  body: '.Admin-form-body textarea[name="body"]'
};

test('Form to create post has title, slug, excerpt, body fields', function () {
  expect(5);

  visit('/admin/create').then(function () {
    var selector;
    for (var input in inputs) {
      if (inputs.hasOwnProperty(input)) {
        selector = inputs[input];
        ok(exists(selector), 'Admin create form has ' + input + ' field');
      }
    }
  });
});

var buttons = {
  save: '.u-save',
  cancel: '.u-cancel',
  preview: '.u-preview',
  destroy: '.u-destroy'
};

test('Form to create a new post has buttons for save, cancel, preview', function () {
  expect(3);

  visit('/admin/create').then(function () {
    var selector, expectedButtons = Ember.String.w('save cancel preview');
    expectedButtons.forEach(function (button) {
      selector = buttons[button];
      ok(exists(selector), button + ' button exists');
    });
  });
});

var dateStamp = Date.now().toString();

var displayText = {
  title: 'New Post Title ' + dateStamp,
  slug: 'new-post-title-' + dateStamp,
  excerpt: 'New Post Excerpt',
  body: 'New Post Body',
  authorName: 'pixelhandler'
};

var content = '.Blog-content';
var template = {
  title: content + ' h1',
  excerpt: content + ' .intro',
  body: content + ' .below-the-fold',
  authorName: content + ' .author'
};

test('Preview of new post', function () {
  expect(5);

  visit('/admin').then(function () {
    click(createPost).then(function () {
      var promises = [];
      fillInNewPost(displayText, promises);
      equal(find(inputs.slug).val(), displayText.slug, 'Slug filled in.');
      expectPostMatches(buttons.preview, displayText, promises);
    });
  });
});

var lastPost = '.Blog-content .Blog-list-item:last';
var lastPostTitle = lastPost + ' .Blog-list-item-title';

test('Save new post, success redirects to index, then delete it', function () {
  expect(3);

  visit('/admin').then(function () {
    click(createPost).then(function () {
      var promises = [], link;
      fillInNewPost(displayText, promises);
      Ember.RSVP.all(promises).then(function () {
        click(buttons.save).then(function () {
          equal(path(), 'admin.index', 'Successfully saving a new post redirects to Admin index');
          ok(hasText(lastPostTitle, displayText.title), 'New post listed after saving');
          click(lastPost + ' ' + buttons.destroy).then(function () {
            notEqual(lastPostTitle, displayText.title, 'New post destroyed');
          });
        });
      });
    });
  });
});

function fillInNewPost(displayValues, promises) {
  var attrs = Ember.String.w('title excerpt body');
  stop();
  attrs.forEach(function (field) {
    promises.push(fillIn(inputs[field], displayValues[field]));
  });
  find(inputs.title).trigger('blur');
  start();
}

function expectPostMatches(action, postData, promises) {
  Ember.RSVP.all(promises).then(function () {
    click(action).then(function () {
      var selector, matching;

      for (var item in template) {
        if (template.hasOwnProperty(item)) {
          selector = template[item];
          matching = postData[item];
          ok(hasText(selector, matching), 'New post has text: ' + matching);
        }
      }
    });
  });
}

}(window));
