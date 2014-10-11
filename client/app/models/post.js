import EO from "ember-orbit";
//import hasOneProxy from "../utils/has-one-proxy";
import uuid from "../utils/uuid";

var attr = EO.attr;
//var key = EO.key;
var hasOne = EO.hasOne;

var Post = EO.Model.extend({
  //id: key({primaryKey: true, defaultValue: uuid}),
  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  // ID for related author is expected in the JSON payload
  //author_id: attr(),

  // Computed property which manages related promise proxy object
  //author: hasOneProxy('author'),
  author: hasOne('author', {inverse: 'posts'}),

  resourceName: 'post'
});

Post.reopenClass({
  newRecord: function () {
    return Ember.Object.create({
      id: uuid(),
      slug: '',
      title: '',
      date: null,
      excerpt: '',
      body: '',
      links: {},

      toJSON: function () {
        var props = "id slug title date excerpt body links".w();
        return this.getProperties(props);
      },
      isNew: true
    });
  },

  createRecord: function (store, newRecord, authorId) {
    return store.add('post', newRecord.toJSON()).then(function (post) {
      var author = store.retrieve('author', authorId);
      post.addLink('author', author).then(function (result) {
        Ember.Logger.info(result);
        /*author.addLink('post', post).then(function (_result) {
          Ember.Logger.info(_result);
        }).catch(function (error) {
          Ember.Logger.error(error);
          window.alert('There was an error linking post to author.');
        });*/
      }).catch(function (error) {
        Ember.Logger.error(error);
        window.alert('There was an error linking author to post.');
      });
    }).catch(function (error) {
      Ember.Logger.error(error);
      window.alert('There was an error creating a new post.');
    });
  }
});

export default Post;
