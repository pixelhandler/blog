import JSONAPISerializer from 'orbit-common/jsonapi-serializer';

export default JSONAPISerializer.extend({
  deserialize: function(type, id, data) {
    this.assignMeta(type, data);
    return this._super(type, id, data);
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
  }
});
