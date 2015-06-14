import Resource from 'ember-jsonapi-resources/models/resource';
import { attr, hasOne } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'comments',
  service: Ember.inject.service('comments'),

  body: attr(),

  date: Ember.computed('attributes', {
    get() {
      return this.get('attributes.created-at');
    }
  }),

  commenter: hasOne('commenter'),
  post: hasOne('post'),

  postId: Ember.computed('relationships', function () {
    return this.get('relationships.post.data.id');
  })
});
