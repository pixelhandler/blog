import EO from "ember-orbit";
//import hasOneProxy from "../utils/has-one-proxy";
import { uuid } from "../utils/uuid";

var attr = EO.attr;
var key = EO.key;
var hasOne = EO.hasOne;

var Post = EO.Model.extend({
  id: key(),
  slug: key({primaryKey: true, defaultValue: uuid}),
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
      slug: '',
      title: '',
      date: null,
      excerpt: '',
      body: '',
      author_id: null,

      toJSON: function () {
        var props = "slug title date excerpt body author_id".w();
        return this.getProperties(props);
      },

      resourceName: 'post'
    });
  }
});

export default Post;
