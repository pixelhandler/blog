import Ember from 'ember';

export default Ember.Mixin.create({

  setupController(controller, collection) {
    this._super(controller, collection);
    if (!this.preventScroll) {
      window.scroll(0, 0);
    }
    this.preventScroll = false;
  },

  preventScroll: null
});
