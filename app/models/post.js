import Resource from 'ember-jsonapi-resources/models/resource';
import { attr, hasOne, hasMany } from 'ember-jsonapi-resources/models/resource';

import Ember from 'ember';

const Post = Resource.extend({
  type: 'posts',
  service: Ember.inject.service('posts'),

  slug: attr(),
  title: attr(),
  date: attr(),
  excerpt: attr(),
  body: attr(),

  author: hasOne('author'),
  comments: hasMany('comments'),
});

Post.reopenClass({
  createSlug(model, title) {
    title = title || model.get('title');
    if (!title || !Ember.isEmpty(model.get('slug'))) { return false; }
    if (Ember.isEmpty(title)) { return title; }
    let slug = title.toLowerCase().dasherize();
    slug = slug.replace(/\(|\)|\[|\]|:|\./g, '');
    model.setProperties({'slugInput': slug, 'slug': slug});
  },

  setDate(model, input) {
    input = input || model.get('dateInput');
    if (!input) { return input; }
    model.set('date', new Date(input));
  }
});

export default Post;
