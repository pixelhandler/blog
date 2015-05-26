import Ember from 'ember';
import computedFake from 'pixelhandler-blog/utils/computed-fake';
import Model from 'pixelhandler-blog/models/base';
import { attr, related } from 'pixelhandler-blog/models/base';

const Post = Model.extend({
  type: 'post',

  slug: attr(),
  title: attr(),
  date: attr(),
  excerpt: attr(),
  body: attr(),

  //author: hasOne('author', { inverse: 'posts' }),
  comments: related('comments'),

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

  createRecord(newRecord, authorId) {
    const payload = newRecord.toJSON();
    payload.links.author = { linkage: { type: 'authors', id: authorId } };
    // TODO use new adapter/service
    // store.add('post', payload);
  },

  deleteRecord(/*record, author*/) {
    // TODO use new adapter/service
    return new Ember.RSVP.Promise(function (resolve, reject) {
      /*author.removeLink('posts', record).then(function () {
        return record.remove();
      }).then(function () {
        resolve();
      }).catch(function(error) {
        Ember.Logger.error(error);
        reject(error);
      });*/
      reject('not implemented');
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
