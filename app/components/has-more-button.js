import Ember from 'ember';

export default Ember.Component.extend({

  hasMore: false,

  loadingMore: false,

  setupListener: function () {
    const listener = this.get('listener');
    $(window).on('scroll', listener);
  }.on('didInsertElement'),

  teardownListener: function () {
    const listener = this.get('listener');
    $(window).off('scroll', listener);
  }.on('willDestroyElement'),

  listener: function () {
    return function () {
      const canLoadMore = this.isLoaderButtonInsideViewport();
      if (canLoadMore) {
        this.send('showMore');
      }
    }.bind(this);
  }.property().readOnly(),

  isLoaderButtonInsideViewport() {
    const btn = this.$('.Blog-showMore.is-ready');
    if (btn.length === 0) {
      return false;
    } else {
      const $win = $(window);
      const scrollTop = $win.scrollTop();
      const height = $win.height();
      const bounds = { top: scrollTop, bottom: scrollTop + height, page: $('body').height() };
      const offset = btn.offset();
      const isInside = (offset.top < bounds.bottom && offset.top > bounds.top);
      const isScrolledToBottom = scrollTop >= bounds.page - height;
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
