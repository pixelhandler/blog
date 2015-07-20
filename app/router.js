import Ember from 'ember';
import config from 'pixelhandler-blog/config/environment';
import AnalyticsTrackingMixin from 'pixelhandler-blog/mixins/analytics-tracking';

var Router = Ember.Router.extend({
  location: config.locationType
});

Ember.Router.reopen(AnalyticsTrackingMixin);

Router.map(function () {
  this.route('about');
  this.route('posts', function () {
    this.route('index', { path: '/' });
  });
  this.route('post', { path: '/posts/:post_slug' }, function () {
    this.route('detail', { path: '/' });
    this.route('comments');
  });
  this.route('admin', function () {
    this.route('index');
    this.route('create');
    this.route('edit', { path: ':edit_id' });
  });
  this.route('offline');
  this.route('not-found', { path: '/*path' });
});

export default Router;
