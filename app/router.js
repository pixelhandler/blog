import Ember from 'ember';
import config from './config/environment';
import AnalyticsTrackingMixin from './mixins/analytics-tracking';

var Router = Ember.Router.extend({
  location: config.locationType
});

Ember.Router.reopen(AnalyticsTrackingMixin);

Router.map(function () {
  this.route('about');
  this.resource('posts', function () {
    this.resource('post', { path: ':post_slug' }, function () {
      this.resource('comments');
    });
  });
  this.route('admin', function () {
    this.route('index');
    this.route('create');
    this.route('edit', { path: ':edit_id' });
  });
  this.route('offline');
  this.route('not-found', { path: '/*path' });

  this.route('posts', function() {
    this.route('comments');
  });
});

export default Router;
