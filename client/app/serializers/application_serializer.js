//'use-strict';

/*
module.exports = App.ApplicationSerializer = DS.RESTSerializer.extend({
  normalize: function(type, hash) {
    if (!hash) { return hash; }
    this.applyTransforms(type, hash);
    var slug = hash.slug;
    hash.slug = hash.id;
    hash.id = slug;
    return hash;
  },

  serialize: function (record, options) {
    var json = this._super.apply(this, arguments);
    if (!json) { return json; }
    if (json.id) {
      json.id = record.get('slug');
    }
    var id = record.get('id');
    if (id) {
      json.slug = id;
    }
    return json;
  }
});
*/
