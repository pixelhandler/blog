import EO from 'ember-orbit';
import uuid from '../utils/uuid';

var attr = EO.attr;
var hasOne = EO.hasOne;

var Post = EO.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  author: hasOne('author', {inverse: 'posts'}),

  resourceName: 'post'
});

Post.reopenClass({
  newRecord: function () {
    return Ember.Object.create({
      id: uuid(), slug: '', title: '', date: null, excerpt: '', body: '', links: {},
      toJSON: function () {
        var props = "id slug title date excerpt body links".w();
        return this.getProperties(props);
      },
      isNew: true
    });
  },

  createRecord: function (store, newRecord, authorId) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      store.add('post', newRecord.toJSON()).then(function (post) {
        var author = store.retrieve('author', authorId);
        return post.addLink('author', author);
      });
      store.then(function (result) {
        Ember.Logger.info(result);
        resolve(result);
      }).catch(function (error) {
        Ember.Logger.error(error);
        reject(error);
      });
    });
  },

  deleteRecord: function (record, author) {
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
  }
});

export default Post;
