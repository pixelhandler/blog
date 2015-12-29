import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(tag) {
    return tag.get('posts');
  }
});
