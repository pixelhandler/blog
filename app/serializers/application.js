import Ember from 'ember';

export default Ember.Object.extend({

  serialize(resources) {
    const json = { data: null };

    if (Array.isArray(resources)) {
      json.data = this.serializeResources(resources);
    } else {
      json.data = this.serializeResource(resources);
    }

    return json;
  },

  serializeResources(resources) {
    const collection = [];

    resources.forEach(function(resource) {
      collection.push(this.serializeRecord(resource));
    }, this);

    return collection;
  },

  serializeResource(resource) {
    return resource.getProperties('type', 'attributes', 'relationships');
  },

  serializeAttribute(/*resource*/) {
    throw Error('not implemented yet.');
  },

  deserialize(resource) {
    if (Array.isArray(resource.data)) {
      return this.deserializeResources(resource.data);
    } else if (typeof resource.data === 'object') {
      return this.deserializeResource(resource.data);
    } else {
      return null;
    }
  },

  deserializeResources(collection) {
    for (let i = 0; i < collection.length; i++) {
      collection[i] = this.deserializeResource(collection[i]);
    }
    return collection;
  },

  deserializeResource(resource) {
    return this._createResourceInstance(resource);
  },

  _createResourceInstance(resource) {
    const factoryName = 'model:' + resource.type;
    return this.container.lookup(factoryName).create({
      'attributes': resource.attributes,
      'id': resource.id,
      'relationships': resource.relationships
    });
  }
});
