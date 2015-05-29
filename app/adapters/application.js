import Ember from 'ember';

const pluralize = Ember.String.pluralize;

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
      if (options.id) {
        return this.findOne(options.id, options.query);
      } else {
        return this.findQuery(options);
      }
    }
  },

  findOne(id, query) {
    let url = this.get('url') + '/' + id;
    url += (query) ? '?' + Ember.$.param(query) : '';
    return this.fetch(url, { method: 'GET' });
  },

  findMany(ids) {
    ids = (Array.isArray(ids)) ? ids.split(',') : ids;
    const url = this.get('url') + '/' + ids;
    return this.fetch(url, { method: 'GET' });
  },

  findQuery(options) {
    options = options || {};
    let url = this.get('url');
    url += (options.query) ? '?' + Ember.$.param(options.query) : '';
    options = options.options || { method: 'GET' };
    return this.fetch(url, options);
  },

  findRelated(resource, url) {
    const service = this.container.lookup('service:' + pluralize(resource));
    return service.fetch(url);
  },

  createRecord(resource) {
    let url = this.get('url');
    const json = this.serializer.serialize(resource);
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Authorization': window.localStorage.getItem('AuthorizationHeader')
      }
    });
  },

  updateRecord() {},
  deleteRecord() {},

  fetch(url, options) {
    return window.fetch(url, options).then(function(resp) {
      if (resp.status >= 400) {
        resp.json().then(function(resp) {
          throw new Error(resp.error);
        });
      } else {
        return resp.json().then(function(resp) {
          const data = this.serializer.deserialize(resp);
          this.cacheResponse({ meta: resp.meta, data: data});
          return data;
        }.bind(this));
      }
    }.bind(this)).catch(function(error) {
      throw error;
    });
  },

  cacheResponse(/*resp*/) {}
});
