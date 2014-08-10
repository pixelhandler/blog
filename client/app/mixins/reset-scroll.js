import Ember from 'ember';

export default Ember.Mixin.create({
  activate: function() {
    this._super();
    if (!this.preventScroll) {
      window.scroll(0, 0);
    }
  },

  setupController: function (controller, collection) {
    this._super(controller, collection);
    this.preventScroll = false;
  },

  preventScroll: false
});
