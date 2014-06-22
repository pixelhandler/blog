import Ember from 'ember';

export default Ember.ArrayController.extend({

  // flag to indicate more content available
  hasMore: null,

  // flag to indicate an is loading state
  loadingMore: null,

  actions: {
    showMore: function () {
      this.set('loadingMore', true);
      return true;
    }
  }
});
