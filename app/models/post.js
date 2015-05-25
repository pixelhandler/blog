import Ember from 'ember';
import computedFake from 'pixelhandler-blog/utils/computed-fake';
import Model from 'pixelhandler-blog/models/base';

const Post = Model.extend({
  type: 'post',

  slug: Ember.computed('attributes', function () {
    return this.get('attributes.slug');
  }),
  title: Ember.computed('attributes', function () {
    return this.get('attributes.title');
  }),

  date: Ember.computed('attributes', function () {
    return this.get('attributes.date');
  }),
  excerpt: Ember.computed('attributes', function () {
    return this.get('attributes.excerpt');
  }),
  body: Ember.computed('attributes', function () {
    return this.get('attributes.body');
  }),
/*
  author: hasOne('author', { inverse: 'posts' }),
  comments: hasMany('comment', { inverse: 'post' }),
*/
  resourceName: 'post',

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

  createRecord(store, newRecord, authorId) {
    const payload = newRecord.toJSON();
    // Had to remove the thenable solution to add links after create
    // record had wrong primary id (client generated?)
    payload.links.author = { linkage: { type: 'authors', id: authorId } };
    store.add('post', payload);
  },

  deleteRecord(record, author) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      author.removeLink('posts', record).then(function () {
        return record.remove();
      }).then(function () {
        resolve();
      }).catch(function(error) {
        Ember.Logger.error(error);
        reject(error);
      });
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
