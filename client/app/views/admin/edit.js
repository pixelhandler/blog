import Ember from 'ember';

export default  Ember.View.extend({
  focusOut: function (evt) {
    if (evt.target.tagName === 'INPUT') {
      this.get('controller').send('inputDidBlur', evt.target.name, evt.target.value);
    }
    return false;
  }
});
