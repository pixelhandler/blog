import Ember from 'ember';

export default Ember.Mixin.create({
  activate: function() {
    this._super();
    window.scroll(0, 0);
  }
});
