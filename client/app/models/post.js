import EO from "ember-orbit";
import hasOneProxy from "../utils/has-one-proxy";

var attr = EO.attr;

var Post = EO.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  // ID for related author is expected in the JSON payload
  author_id: attr(),

  // Computed property which manages related promise proxy object
  author: hasOneProxy('author'),

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
