import Resource from 'ember-jsonapi-resources/models/resource';
import { attr, hasMany } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'commenters',
  service: Ember.inject.service('commenters'),

  name: attr(),
  email: attr(),
  hash: attr(),

  comments: hasMany('comments')
});
