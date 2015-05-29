import Ember from 'ember';

const pluralize = Ember.String.pluralize;

const Resource = Ember.Object.extend({
  type: null,
  attributes: {},
  links: {},

  toString() {
    return "[%@Resource:%@]".fmt(this.get('type'), this.get('id'));
  },

  addLink(related, id) {
    const key = 'links.' + related;
    const linked = this.get(key);
    const type = pluralize(related);
    let linkage = { linkage: { type: type, id: id } };
    if (Array.isArray(linked)) {
      linked.pushObject(linkage);
    } else if (!!linked) {
      linked.linkage.id = id;
    }
    return this.set(key, linkage);
  }
});

export default Resource;

export function attr(type, mutable = false) {
  const _mutable = mutable;
  return Ember.computed('attributes', {
    get: function (key) {
      return this.get('attributes.' + key);
    },

    set: function (key, value) {
      if (!_mutable) { return this.get('attributes.' + key); }
      this.set('attributes.' + key, value);
      return this.get('attributes.' + key);
    }
  });
}

const RelatedProxyUtil = Ember.Object.extend({
  init: function () {
    this._super();
    if (typeof this.get('resource') !== 'string') {
      throw new Error('RelatedProxyUtil#init expects `resource` property to exist.');
    }
    return this;
  },

  _proxy: null,

  createProxy: function (model, proxyFactory) {
    const resource = this.get('resource');
    const url = this._proxyUrl(model, resource);
    const proxy = proxyFactory.extend(Ember.PromiseProxyMixin, {
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

  _proxyUrl(model, resource) {
    const related = 'links.' + resource + '.related';
    const url = model.get(related);
    if (typeof url !== 'string') {
      throw new Error('RelatedProxyUtil#_proxyUrl expects `model.'+ related +'` property to exist.');
    }
    return url;
  }
});

export function hasOne(resource) {
  const util = RelatedProxyUtil.create({'resource': resource});
  return Ember.computed('links.' + resource + '.related', function () {
    util.createProxy(this, Ember.ObjectProxy);
    return util._proxy;
  });
}

export function hasMany(resource) {
  const util = RelatedProxyUtil.create({'resource': resource});
  return Ember.computed('links.' + resource + '.related', function () {
    util.createProxy(this, Ember.ArrayProxy);
    return util._proxy;
  });
}
