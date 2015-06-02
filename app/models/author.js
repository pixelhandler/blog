import Resource from 'ember-jsonapi-resources/models/resource';
import { attr, hasMany, hasRelated } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'authors',

  name: attr(),
  email: attr(),

  relationships: hasRelated('posts'),
  posts: hasMany('posts')
});
