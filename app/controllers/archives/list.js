import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showMore() {
      this.set('loadingMore', true);
      this.get('target').send('showMore');
    }
  }
});
