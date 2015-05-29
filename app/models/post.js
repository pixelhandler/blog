import Ember from 'ember';
import computedFake from 'pixelhandler-blog/utils/computed-fake';
import Resource from 'pixelhandler-blog/models/base';
import { attr, hasOne, hasMany } from 'pixelhandler-blog/models/base';

const Post = Resource.extend({
  type: 'posts',

  slug: attr(),
  title: attr(),
  date: attr(),
  excerpt: attr(),
  body: attr(),

  author: hasOne('author'),
  comments: hasMany('comments'),

  slugInput: computedFake('model.slug'),
  titleInput: computedFake('model.title'),
  excerptInput: computedFake('model.excerpt'),
  bodyInput: computedFake('model.body'),
  dateInput: null
});

Post.reopenClass({
  newRecord() {
    return Ember.Object.create({
      type: 'posts', slug: '', title: '', date: null, excerpt: '', body: '', links: {},
      toJSON: function () {
        var props = "type slug title date excerpt body links".w();
        return this.getProperties(props);
      },
      isNew: true
    });
  },

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
