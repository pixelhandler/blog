import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      let metrics = Ember.get(this, 'metrics');
      if (metrics && typeof metrics.trackPage === 'function') {
        Ember.run.later(function() {
          let page = document.location.pathname;
          let title = document.querySelector('title').innerText;
          if (window.ga && typeof window.ga === 'function') {
            metrics.trackPage('GoogleAnalytics', { page: page, title: title});
          }
        }, 30);
      }
    });
  }
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
  this.route('tags');
  this.route('tag', { path: '/tag/:tag_slug' }, function() {
    this.route('excerpts', { path: '/' });
  });
  this.route('not-found', { path: '/*path' });
});

export default Router;
