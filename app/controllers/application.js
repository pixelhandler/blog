import Ember from 'ember';

export default Ember.Controller.extend({

  isTwoColumns: true,

  isLoggedIn: false,

  isSearchEnabled: false,

  searchFilter: '',

  asideDisplayButton: function () {
    return (this.get('isTwoColumns')) ? 'one column' : 'two columns';
  }.property('isTwoColumns'),

  actions: {
    toggleAside() {
      this.toggleProperty('isTwoColumns');
    }
  }
});

