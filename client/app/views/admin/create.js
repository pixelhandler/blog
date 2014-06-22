import Ember from 'ember';

export default  Ember.View.extend({
  focusOut: function (evt) {
    if (evt.target.name === 'title') {
      this.get('controller').send('titleChanged');
    }
    return false;
  }
});
