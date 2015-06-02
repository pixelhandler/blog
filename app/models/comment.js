import Resource from 'ember-jsonapi-resources/models/resource';
import { attr, hasOne, hasRelated } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'comments',

  body: attr(),

  date: Ember.computed('attributes', {
    get() {
      return this.get('attributes.created-at');
    }
  }),

  relationships: hasRelated('commenter', 'post'),
  commenter: hasOne('commenter'),
  post: hasOne('post'),

  postId: Ember.computed('relationships', function () {
    return this.get('relationships.post.data.id');
  })
});
