import Ember from 'ember';
import Resource from './resource';
import { attr, hasMany } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'tags',
  service: Ember.inject.service('tags'),

  name: attr('string'),
  slug: attr('string'),

  posts: hasMany('posts')
});
