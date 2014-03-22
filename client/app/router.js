'use-strict';

App.Router.reopen({ location: 'history' });

module.exports = App.Router.map(function () {
  this.route('about');
  this.resource('posts', function () {
    this.resource('post', { path: ':post_id' });
  });
  this.resource('admin', function () {
    this.route('create');
    this.route('edit', { path: ':edit_id' });
  });
  this.route('not-found', { path: '/*path' });
});
