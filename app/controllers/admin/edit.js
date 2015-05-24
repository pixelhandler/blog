import Ember from 'ember';

export default Ember.Controller.extend({

  isEditing: true,

  actions: {
    inputDidBlur(name, value) {
      var prop = this.get(name);
      if (value !== prop) {
        const model = this.get('model');
        model.set(name, value);
      }
    },

    edit() {
      this.set('isEditing', true);
    },

    done() {
      this.set('isEditing', false);
    }
  }
});
