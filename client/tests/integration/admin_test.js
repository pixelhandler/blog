(function (window) {

module('Admin', {
  setup: function () {
    window.showdown = new Showdown.converter();
  },
  teardown: function () {
    unload('post');
    App.reset();
  }
});

var enableAdmin = '.u-enableAdmin';
var disableAdmin = '.u-disableAdmin';

test('Admin must be enabled', function () {
  expect(1);

  visit('/admin').then(function () {
    equal(path(), 'index', 'Redirects to / if admin is not enabled');
  });
});

var inputs = {
  username: '.Footer input[name="username"]',
  password: '.Footer input[name="password"]'
};

test('Admin form shown in footer when clicking admin link', function () {
  expect(2);

  visit('/').then(function () {
    click(enableAdmin).then(function () {
      var selector;
      for (var input in inputs) {
        if (inputs.hasOwnProperty(input)) {
          selector = inputs[input];
          ok(exists(selector), 'Footer has ' + input + ' field');
        }
      }
    });
  });
});

test('Cancel link hides login form', function () {
  expect(4);
  visit('/').then(function () {
    click(enableAdmin).then(function () {
      throws(exists(enableAdmin), 'Admin link not shown');
      ok(exists(disableAdmin), 'Cancel link shown');
      click(disableAdmin).then(function () {
        throws(exists(disableAdmin), 'Cancel link not shown');
        ok(exists(enableAdmin), 'Admin link shown');
      });
    });
  });
});

var login = '.Footer .u-login';
var logout = 'Footer .u-logout';

test('Admin index available after login', function () {
  expect(1);
  visit('/').then(function () {
    click(enableAdmin).then(function () {
      fillIn(inputs.username, 'admin').then(function () {
        fillIn(inputs.password, 'admin').then(function () {
          click(login).then(function () {
            equal(path(), 'admin.index', 'Redirects to /admin when enabled');
            // teardown
            click(logout);
          });
        });
      });
    });
  });
});

test('Index page shown after logout', function () {
  expect(1);
  visit('/').then(function () {
    click(enableAdmin).then(function () {
      fillIn(inputs.username, 'admin').then(function () {
        fillIn(inputs.password, 'admin').then(function () {
          click(login).then(function () {
            click(logout).then(function () {
              equal(path(), 'index', 'Redirects to / after logout');
            });
          });
        });
      });
    });
  });
});

}(window));
