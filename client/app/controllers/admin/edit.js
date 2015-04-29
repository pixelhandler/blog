import Ember from 'ember';

export default Ember.Controller.extend({

  isEditing: true,

  actions: {
    inputDidBlur: function (name, value) {
      var prop = this.get(name);
      if (value !== prop) {
        const model = this.get('model');
        model.set(name, value);
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
