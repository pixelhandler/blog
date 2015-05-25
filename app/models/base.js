import Ember from 'ember';

export default Ember.Object.extend({
  type: null,

  attributes: null,

  toString() {
    return "[%@Model:%@]".fmt(this.get('type'), this.get('id'));
  }
});
