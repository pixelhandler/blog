import Ember from 'ember';
import Post from 'pixelhandler-blog/models/post';

export default Ember.Controller.extend({

  isEditing: true,
  isPreviewing: false,

  actions: {
    inputDidBlur: function (name, value) {
      const model = this.get('model');
      const prop = model.get(name);
      if (value !== prop) {
        model.set(name, value);
        if (name === 'title' && model.get('isNew')) {
          Post.createSlug(model, value);
        }
        if (name === 'date') {
          Post.setDate(model, value);
        }
      }
    },

    edit() {
      this.set('isPreviewing', false);
    },

    preview() {
      this.set('isPreviewing', true);
    },

    save() {
      this.setProperties({'isEditing': false, 'isPreviewing': false});
      return true; // bubble
    },

    cancel() {
      this.setProperties({'isEditing': false, 'isPreviewing': false});
      return true; // bubble
    }
  }
});
