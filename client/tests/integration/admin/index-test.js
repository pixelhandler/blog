import { test } from 'ember-qunit';
import startApp from '../../helpers/start-app';

var App;

var enableAdmin = '.u-enableAdmin';
var disableAdmin = '.u-disableAdmin';
var inputs = {
  username: '.Footer input[name="username"]',
  password: '.Footer input[name="password"]'
};
var login = '.Footer .u-login';
var logout = 'Footer .u-logout';

module('Admin Index', {
  setup: function () {
    window.showdown = new Showdown.converter();
    App = startApp();
    stop();
    visit('/').then(function () {
      click(enableAdmin).then(function () {
        fillIn(inputs.username, 'admin').then(function () {
          fillIn(inputs.password, 'admin').then(function () {
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
        Ember.run(App, App.destroy);
      });
    });
  }
});

var list = '.Blog-content .Blog-list';
var item = list + '-item';
var date = list + '-date';
var title = item + '-title';
var editButton = item + ' .u-edit';
var deleteButton = item + ' .u-destroy';

test('Admin Index template lists posts', function () {
  expect(6);
  visit('/admin').then(function () {
    ok(exists(list), 'Admin index template has list of post(s).');
    ok(exists(date), 'post date exists');
    ok(exists(item), 'post item exists');
    ok(exists(title), 'post title exists');
    ok(exists(editButton), 'post edit button exists');
    ok(exists(deleteButton), 'post delete button exists');
  });
});
