import Ember from 'ember';

export default Ember.Object.extend({
  type: null,

  attributes: null,

  toString() {
    return "[%@Model:%@]".fmt(this.get('type'), this.get('id'));
  }
});

export function attr() {
  return Ember.computed('attributes', function (key) {
    return this.get('attributes.' + key);
  });
}

const ArrayProxy = Ember.ArrayProxy;
const PromiseProxyMixin = Ember.PromiseProxyMixin;
const get = Ember.get;

const RelatedProxyUtil = Ember.Object.extend({
  init: function () {
    this._super();
    if (typeof get(this, 'resource') !== 'string') {
      throw new Error('RelatedProxyUtil#init expects `resource` property to exist.');
    }
    return this;
  },

  createProxy: function (model) {
    const resource = get(this, 'resource');
    const url = this._proxyUrl(model, resource);
    const proxy = ArrayProxy.extend(PromiseProxyMixin, {
      promise: model.service.findRelated(resource, url)
    });
    this._proxy = proxy.create();
    this._proxy.then(
      function (resources) {
        this._proxy.set('content', resources);
      }.bind(this),
      function (error) {
        console.error(error);
        throw error;
      }
    );
  },

  _proxy: null,

  _proxyUrl(model, resource) {
    const related = 'links.' + resource + '.related';
    const url = model.get(related);
    if (typeof url !== 'string') {
      throw new Error('RelatedProxyUtil#_proxyUrl expects `model.'+ related +'` property to exist.');
    }
    return url;
  }
});

export function related(resource) {
  const util = RelatedProxyUtil.create({'resource': resource});
  return Ember.computed('links.' + resource, function () {
    if (util._proxy === null) {
      util.createProxy(this);
    }
    return util._proxy;
  });
}
