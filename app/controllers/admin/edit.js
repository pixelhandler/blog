import Ember from 'ember';

export default Ember.Controller.extend({

  isEditing: true,

  actions: {
    edit() {
      this.set('isEditing', true);
    },

    done() {
      this.set('isEditing', false);
    }
  }
});
