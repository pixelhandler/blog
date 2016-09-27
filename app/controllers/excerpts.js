import Ember from 'ember';

const { Controller, inject, computed } = Ember;

export default Controller.extend({
  application: inject.controller('application'),

  queryParams: { searchFilter: 'search'},
  searchFilter: computed.alias('application.searchFilter'),

  // flag to show button for more
  hasMore: true,

  // flag to indicate an is loading state
  loadingMore: false,

  actions: {
    showMore() {
      this.set('loadingMore', true);
      this.get('target').send('showMore');
    }
  }
});
