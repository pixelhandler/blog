import JSONAPISerializer from 'orbit-common/jsonapi-serializer';

export default JSONAPISerializer.extend({
  deserialize: function(type, id, data) {
    data[type + 's'] = data.data;
    delete data.data;
    this.assignMeta(type, data);
    return this._super(type, id, data);
  },

  deserializeRecord: function(type, id, data) {
    if (id && data && id === data.slug) {
      id = data.id;
    }
    return this._super(type, id, data);
  },

  assignMeta: function (type, data) {
    if (!data || !data.meta) {
      return;
    }
    const meta = this.schema.meta;
    if (!meta.get(type)) {
      meta.set(type, Ember.Object.create());
    }
    const metaByType = meta.get(type);
    metaByType.set('total', data.meta.page.total);
  },

  serialize: function(type, records) {
    let json = {};

    if (Array.isArray(records)) {
      json.data = this.serializeRecords(type, records);
    } else {
      json.data = this.serializeRecord(type, records);
    }

    return json;
  },

  serializeRecords: function(type, records) {
    let json = [];

    records.forEach(function(record) {
      json.push(this.serializeRecord(type, record));
    }, this);

    return json;
  },

  serializeRecord: function(type, record) {
    const resourceType = this.resourceType(type);
    let json = { type: resourceType };

    this.serializeKeys(type, record, json);
    this.serializeAttributes(type, record, json);
    this.serializeLinks(type, record, json);

    return json;
  },

  serializeLinks: function(type, record, json) {
    var modelSchema = this.schema.models[type];
    var linkNames = Object.keys(modelSchema.links);

    if (linkNames.length > 0) {
      json.links = {};

      linkNames.forEach(function (link) {
        var linkDef = modelSchema.links[link];
        var value = record.__rel[link];

        if (linkDef.type === 'hasMany') {
          json.links[link] = { linkage: [] };
          for (var i = 0; i < value.length; i++) {
            json.links[link].linkage.push({type: link, id: value[i]});
          }
        } else {
          json.links[link] = { linkage: { type: link, id: value } };
        }
      }, this);
    }
  }
});
