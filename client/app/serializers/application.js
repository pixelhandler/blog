import JSONAPISerializer from 'orbit-common/jsonapi-serializer';

export default JSONAPISerializer.extend({
  normalize: function (type, data) {
    return this._super(type, data);
  },

  deserialize: function(type, data) {
    this.assignMeta(type, data);
    data = this.deserializeRelations(type, data);
    return this._super(type, data);
  },

  assignMeta: function (type, data) {
    if (!data.meta) {
      return;
    }
    var meta = this.schema.meta;
    if (!meta.get(type)) {
      meta.set(type, Ember.Object.create());
    }
    var metaByType = meta.get(type);
    metaByType.set('total', data.meta.total);
  },

  deserializeRelations: function (type, data) {
    if (type === 'post') {
      data = this.deserializePosts(data);
    } else if (type === 'author') {
      data = this.deserializeAuthors(data);
    }
    return data;
  },

  deserializePosts: function (data) {
    var posts = data.posts;
    if (Array.isArray(posts)) {
      for (var i = posts.length - 1; i >= 0; i--) {
        posts[i].author_id = posts[i].links.author;
        delete posts[i].links;
      }
    } else if (typeof posts === "object") {
      posts.author_id = posts.links.author;
      delete posts.links;
    }
    return data;
  },

  deserializeAuthors: function (data) {
    var authors = data.authors;
    if (Array.isArray(authors)) {
      for (var i = authors.length - 1; i >= 0; i--) {
        authors[i].post_ids = authors[i].links.posts;
        delete authors[i].links;
      }
    } else if (typeof authors === "object") {
      authors.post_ids = authors.links.posts;
      delete authors.links;
    }
    return data;
  },

  serialize: function (type, data) {
    data = this.serializeRelations(type, data);
    return this._super(type, data);
  },

  serializeRelations: function (type, data) {
    if (type === 'post') {
      data = this.serializePosts(data);
    } else if (type === 'author') {
      data = this.serializeAuthors(data);
    }
    return data;
  },

  serializePosts: function (data) {
    var posts = data.posts;
    if (Array.isArray(posts)) {
      for (var i = posts.length - 1; i >= 0; i--) {
        posts[i].links = { author: posts[i].author_id };
        delete posts[i].author_id;
        posts(posts[i]);
      }
    } else if (typeof posts === "object") {
      posts.links = { author: posts.author_id };
      delete posts.author_id;
      sanitize(posts);
    }
    return data;
  },

  serializeAuthors: function (data) {
    var authors = data.authors;
    if (Array.isArray(authors)) {
      for (var i = authors.length - 1; i >= 0; i--) {
        authors[i].links = { posts: authors[i].post_ids };
        delete authors[i].post_ids;
        sanitize(authors[i]);
      }
    } else if (typeof posts === "object") {
      authors.links = { posts: authors.post_ids };
      delete authors.post_ids;
      sanitize(authors);
    }
    return data;
  },
});

function sanitize(record) {
  var keys = "meta normalized rel rev".w().map(function (key) {
    return "__%@".fmt(key);
  });
  for (var i = 0; i < keys.length; i++) {
    if (record.hasOwnProperty(keys[i])) {
      delete record[keys[i]];
    }
  }
  return record;
}
