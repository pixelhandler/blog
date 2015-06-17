import Ember from 'ember';

export default Ember.Controller.extend({
  // flag to show button for more
  hasMore: true,

  // flag to indicate an is loading state
  loadingMore: false,

  actions: {
    showMore() {
      this.set('loadingMore', true);
      return true;
    }
  }
});
