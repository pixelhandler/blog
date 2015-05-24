import JSONAPISerializer from 'orbit-common/jsonapi-serializer';

export default JSONAPISerializer.extend({
  deserialize(type, id, data) {
    data[type + 's'] = data.data;
    delete data.data;
    this.assignMeta(type, data);
    return this._super(type, id, data);
  },

  deserializeRecord(type, id, data) {
    if (id && data && id === data.slug) {
      id = data.id;
    }
    if (data.hasOwnProperty('attributes')) {
      for (var key in data.attributes) {
        if (data.attributes.hasOwnProperty(key)) {
          data[key] = data.attributes[key];
        }
      }
      delete data.attributes;
    }
    return this._super(type, id, data);
  },

  assignMeta(type, data) {
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

  serialize(type, records) {
    let json = {};

    if (Array.isArray(records)) {
      json.data = this.serializeRecords(type, records);
    } else {
      json.data = this.serializeRecord(type, records);
    }

    return json;
  },

  serializeRecords(type, records) {
    let json = [];

    records.forEach(function(record) {
      json.push(this.serializeRecord(type, record));
    }, this);

    return json;
  },

  serializeRecord(type, record) {
    const resourceType = this.resourceType(type);
    let json = { type: resourceType };
    this.serializeKeys(type, record, json);
    this.serializeAttributes(type, record, json);
    this.serializeLinks(type, record, json);
    return json;
  },

  serializeAttributes(type, record, json) {
    const modelSchema = this.schema.models[type];
    json.attributes = json.attributes || {};
    Object.keys(modelSchema.attributes).forEach(function(attr) {
      this.serializeAttribute(type, record, attr, json.attributes);
    }, this);
  },

  /*serializeAttribute(type, record, attr, json) {
    json[this.resourceAttr(type, attr)] = record[attr];
  },*/

  serializeLinks(type, record, json) {
    const modelSchema = this.schema.models[type];
    const linkNames = Object.keys(modelSchema.links);

    if (linkNames.length > 0) {
      json.links = {};

      linkNames.forEach(function (link) {
        const linkDef = modelSchema.links[link];
        const value = record.__rel[link];

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
