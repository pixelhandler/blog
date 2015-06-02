import Resource from 'ember-jsonapi-resources/models/resource';
import { attr, hasMany, hasRelated } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'commenters',

  name: attr(),
  email: attr(),
  hash: attr(),

  relationships: hasRelated('comments'),
  comments: hasMany('comments')
});
