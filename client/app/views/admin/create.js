'use-strict';

module.exports = App.AdminCreateView = Ember.View.extend({
  focusOut: function (evt) {
    if (evt.target.name === 'title') {
      this.get('controller').send('titleChanged');
    }
    return false;
  }
});
