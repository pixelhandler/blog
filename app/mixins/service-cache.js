import Ember from 'ember';

export default Ember.Mixin.create({
  cache: {
    meta: null,
    data: Ember.ArrayProxy.create({ content: [] })
  },

  cacheResponse(resp) {
    this.set('cache.meta', resp.meta);
    const data = this.get('cache.data');
    if (Array.isArray(resp.data)) {
      for (let i = 0; i < resp.data.length; i++) {
        addUnique(data, resp.data[i]);
      }
    } else if (typeof resp === 'object') {
      addUnique(data, resp.data);
    }
  }
});

function addUnique(resources, resource) {
  if (!resources.contains(resource)) {
    resources.pushObject(resource);
  }
}
