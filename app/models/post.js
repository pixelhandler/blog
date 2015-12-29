import Ember from 'ember';
import Resource from './resource';
import { attr, hasOne, hasMany } from 'ember-jsonapi-resources/models/resource';

export default Resource.extend({
  type: 'posts',
  service: Ember.inject.service('posts'),

  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  author: hasOne('author'),
  comments: hasMany('comments'),
  tags: hasMany('tags')
});
