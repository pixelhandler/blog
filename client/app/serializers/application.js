import JSONAPISerializer from 'orbit-common/jsonapi-serializer';

export default JSONAPISerializer.extend({
  normalize: function (type, data) {
    return this._super(type, data);
    //if (!hash) { return hash; }
    //this.applyTransforms(type, hash);
    //var slug = hash.slug;
    //hash.slug = hash.id;
    //hash.id = slug;
    //return hash;
  },

  deserialize: function(type, data) {
    this.assignMeta(type, data);
    return this._super(type, data);
  },

  assignMeta: function (type, data) {
    var meta = this.schema.meta;
    if (!meta.get(type)) {
      meta.set(type, Ember.Object.create());
    }
    var metaByType = meta.get(type);
    metaByType.set('total', data.meta.total);
  },

  serialize: function (type, data) {
    //var json = this._super.apply(this, arguments);
    //if (!json) { return json; }
    //if (json.id) {
      //json.id = record.get('slug');
    //}
    //var id = record.get('id');
    //if (id) {
      //json.slug = id;
    //}
    //return json;
    return this._super(type, data);
  }
});
