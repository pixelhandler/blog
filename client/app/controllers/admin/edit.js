import Ember from 'ember';

export default Ember.ObjectController.extend({
  isEditing: false,

  actions: {
    edit: function () {
      this.set('isEditing', true);
    },

    preview: function () {
      this.set('isEditing', false);
    },

    save: function () {
      this.set('isEditing', false);
      return true; // bubble
    }
  }
});
