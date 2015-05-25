import Ember from 'ember';

export default Ember.Object.extend({
  type: null,

  serialize() {},
  serializeRecords() {},
  serializeRecord() {},
  serializeLinks() {},
  serializeLink() {},

  deserialize(payload) {
    if (Array.isArray(payload.data)) {
      return this.deserializeRecords(payload.data);
    } else if (typeof payload.data === 'object') {
      return this.deserializeRecord(payload.data);
    } else {
      return null;
    }
  },

  deserializeRecords(collection) {
    for (let i = 0; i < collection.length; i++) {
      collection[i] = this.deserializeRecord(collection[i]);
    }
    return collection;
  },

  deserializeRecord(resource) {
    return this._createModelInstance(resource);
  },

  _createModelInstance(resource) {
    const factoryName = 'model:' + this.get('type');
    return this.container.lookup(factoryName).create({
      'attributes': resource.attributes,
      'id': resource.id,
      'links': resource.links
    });
  }
});
