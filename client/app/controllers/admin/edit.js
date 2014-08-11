import Ember from 'ember';
import computedFake from '../../utils/computed-fake';

export default Ember.ObjectController.extend({
  isEditing: true,

  slugInput: computedFake('slug'),
  titleInput: computedFake('title'),
  excerptInput: computedFake('excerpt'),
  bodyInput: computedFake('body'),

  actions: {
    inputDidBlur: function (name, value) {
      var prop = this.get(name);
      if (value !== prop) {
        this.set(name, value);
      }
    },

    edit: function () {
      this.set('isEditing', true);
    },

    done: function () {
      this.set('isEditing', false);
    }
  }
});
