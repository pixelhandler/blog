import Resource from 'pixelhandler-blog/models/base';
import { attr, hasOne, hasRelated } from 'pixelhandler-blog/models/base';

export default Resource.extend({
  type: 'comments',

  body: attr(),

  date: Ember.computed('attributes', function () {
    return this.get('attributes.created-at');
  }),

  relationships: hasRelated('commenter', 'post'),
  commenter: hasOne('commenter'),
  post: hasOne('post'),

  postId: Ember.computed('links', function () {
    return this.get('links.post.linkage.id');
  })
});
