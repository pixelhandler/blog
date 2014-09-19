import Ember from 'ember';

export default Ember.Component.extend({

  hasMore: false,

  loadingMore: false,

  setupListener: function () {
    var listener = this.get('listener');
    $(window).on('scroll', listener);
  }.on('didInsertElement'),

  teardownListener: function () {
    var listener = this.get('listener');
    $(window).off('scroll', listener);
  }.on('willDestroyElement'),

  listener: function () {
    return function () {
      var canLoadMore = this.isLoaderButtonInsideViewport();
      if (canLoadMore) {
        this.send('showMore');
      }
    }.bind(this);
  }.property().readOnly(),

  isLoaderButtonInsideViewport: function () {
    var btn = this.$('.Blog-showMore.is-ready');
    if (btn.length === 0) {
      return false;
    } else {
      var $win = $(window);
      var scrollTop = $win.scrollTop();
      var height = $win.height();
      var bounds = { top: scrollTop, bottom: scrollTop + height, page: $('body').height() };
      var offset = btn.offset();
      var isInside = (offset.top < bounds.bottom && offset.top > bounds.top);
      var isScrolledToBottom = scrollTop >= bounds.page - height;
      return isInside && !isScrolledToBottom;
    }
  },

  actions: {
    showMore: function () {
      Ember.run.throttle(this, this.dispatcher, 3000, true);
    }
  },

  dispatcher: function () {
    this.get('targetObject').send('showMore');
  }
});
