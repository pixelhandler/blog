import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  type: null,

  find(options) {
    if (typeof options === 'string') {
      if (options.match(',') !== null) {
        return this.findMany(options);
      } else {
        return this.findOne(options);
      }
    } else if (Array.isArray(options)) {
      return this.findMany(options);
    } else if (typeof options === 'object') {
      return this.findQuery(options);
    }
  },

  findOne(id) {
    const url = this.get('url') + '/' + id;
    return this._fetch(url, { method: 'GET' });
  },

  findMany(ids) {
    ids = (Array.isArray(ids)) ? ids.split(',') : ids;
    const url = this.get('url') + '/' + ids;
    return this._fetch(url, { method: 'GET' });
  },

  findQuery(options) {
    options = options || {};
    let url = this.get('url');
    url += (options.query) ? '?' + Ember.$.param(options.query) : '';
    return this._fetch(url, { method: 'GET' });
  },

  createRecord() {},
  updateRecord() {},
  deleteRecord() {},

  _fetch(url, options) {
    return window.fetch(url, options).then(function(resp) {
      return resp.json().then(function(resp) {
        this.cache.meta = resp.meta;
        return this.serializer.deserialize(resp);
      }.bind(this));
    }.bind(this)).catch(function(error) {
      throw error;
    });
  }
});
