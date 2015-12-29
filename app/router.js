import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('excerpts', { path: '/' });
  this.route('about');
  this.route('archives', { path: '/posts' }, function () {
    this.route('list', { path: '/' });
  });
  this.route('post', { path: '/posts/:post_slug' }, function () {
    this.route('details', { path: '/' });
    this.route('comments');
  });
  this.route('tag', { path: '/tag/:tag_slug' }, function() {
    this.route('excerpts', { path: '/' });
  });
  this.route('not-found', { path: '/*path' });
  this.route('tags');
});

export default Router;
