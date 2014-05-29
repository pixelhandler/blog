'use-strict';

module.exports = App.ResetScroll = Ember.Mixin.create({
  activate: function() {
    this._super();
    window.scroll(0, 0);
  }
});
