import Ember from 'ember';

export default Ember.Component.extend({

  hasMore: false,

  loadingMore: false,

  setupListener: function () {
    let listener = this.get('listener');
    Ember.$(window).on('scroll', listener);
  }.on('didInsertElement'),

  teardownListener: function () {
    let listener = this.get('listener');
    Ember.$(window).off('scroll', listener);
  }.on('willDestroyElement'),

  listener: function () {
    return function () {
      let canLoadMore = this.isLoaderButtonInsideViewport();
      if (canLoadMore) {
        this.send('showMore');
      }
    }.bind(this);
  }.property().readOnly(),

  isLoaderButtonInsideViewport() {
    let btn = this.$('.Blog-showMore.is-ready');
    if (btn.length === 0) {
      return false;
    } else {
      let $win = Ember.$(window);
      let scrollTop = $win.scrollTop();
      let height = $win.height();
      let bounds = { top: scrollTop, bottom: scrollTop + height, page: Ember.$('body').height() };
      let offset = btn.offset();
      let isInside = (offset.top < bounds.bottom && offset.top > bounds.top);
      let isScrolledToBottom = scrollTop >= bounds.page - height;
      return isInside && !isScrolledToBottom;
    }
  },

  actions: {
    showMore() {
      Ember.run.throttle(this, this.dispatcher, 3000, true);
    }
  },

  dispatcher() {
    this.get('targetObject').send('showMore');
  }
});

