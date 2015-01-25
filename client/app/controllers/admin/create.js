import Ember from 'ember';
import computedFake from '../../utils/computed-fake';

export default Ember.ObjectController.extend({

  isPreviewing: false,

  createSlug: function () {
    var title = this.get('title');
    if (!title || this.get('slug')) { return false; }
    this.set('slug', this.slugify(this.get('title')));
  },

  slugify: function (title) {
    if (!title) { return title; }
    var slug = title.toLowerCase().dasherize();
    slug = slug.replace(/\(|\)|\[|\]|:|\./g, '');
    return slug;
  },

  slugInput: computedFake('slug'),

  dateInput: null,

  dateInputChanged: function () {
    var input = this.get('dateInput');
    if (!input) { return input; }
    this.set('date', new Date(input));
  }.observes('dateInput'),

  actions: {
    inputDidBlur: function (name, value) {
      var prop = this.get(name);
      if (value !== prop) {
        this.set(name, value);
        if (name === 'title' && this.get('isNew')) {
          this.createSlug();
        }
      }
    },

    edit: function () {
      this.set('isPreviewing', false);
    },

    preview: function () {
      this.set('isPreviewing', true);
    },

    save: function () {
      this.setProperties({'isEditing': false, 'isPreviewing': false});
      return true; // bubble
    },

    cancel: function () {
      this.setProperties({'isEditing': false, 'isPreviewing': false});
      return true; // bubble
    }
  }
});
