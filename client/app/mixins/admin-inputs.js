import Ember from 'ember';

export default Ember.Mixin.create({
  focusOut: function (evt) {
    if ('TEXTAREA INPUT'.w().contains(evt.target.tagName)) {
      this.get('controller').send('inputDidBlur', evt.target.name, evt.target.value);
    }
    return false;
  }
});
