import Ember from "ember";

var ObjectProxy = Ember.ObjectProxy;
var PromiseProxyMixin = Ember.PromiseProxyMixin;
var get = Ember.get;

var HasOneProxyHelper = Ember.Object.extend({
  init: function () {
    this._super();
    if (typeof get(this, 'resource') !== 'string') {
      throw new Error('HasOneProxyHelper#init expects `resource` property to exist.');
    }
    this[get(this, 'proxyName')] = null;
    return this;
  },

  // model instance as reference for related id
  // expected to have foreign key as a property, e.g. `author_id`
  model: null,

  relatedKey: function () {
    return "%@_id".fmt(get(this, 'resource'));
  }.property('resource'),

  relatedId: function () {
    var key = get(this, 'relatedKey');
    var model = get(this, 'model');
    return get(model, key);
  }.property('relatedKey', 'model'),

  proxyName: function () {
    return "_%@Proxy".fmt(get(this, 'resource'));
  }.property('resource'),

  needsProxy: function () {
    var proxy = this[get(this, 'proxyName')];
    return proxy === null || proxy.get('id') !== get(this, 'relatedId');
  },

  createProxy: function () {
    var model = get(this, 'model');
    var proxy = ObjectProxy.extend(PromiseProxyMixin, {
      promise: model.store.find(get(this, 'resource'), get(this, 'relatedId'))
    });
    var proxyProp = proxy.create();
    proxyProp.then(
      function (relatedModel) {
        this[get(this, 'proxyName')].set('content', relatedModel);
      }.bind(this),
      function (error) {
        console.log(error);
      }
    );
    this[get(this, 'proxyName')] = proxyProp;
  }
});

/**
  hasOneProxy helper is based on a computed property that manages a promise proxy
  object, it encapsulates the work to find a related model (n:1)

  // Not using ember-orbit relations, `author: EO.hasOne('author')`
  // Instead use a computed property with proxy object
  author: Ember.computed('author_id', function () {
    var id = this.get('author_id');
    if (this._authorProxy === null || this._authorProxy.get('id') !== id) {
      var proxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin, {
        promise: this.store.find('author', id)
      });
      this._authorProxy = proxy.create();
      this._authorProxy.then(
        function (author) { this._authorProxy.set('content', author); }.bind(this),
        function (error) { console.log(error); }
      );
    }
    return this._authorProxy;
  }),
*/
export default function hasOneProxy(resource) {
  var helper = HasOneProxyHelper.create({'resource': resource});
  return Ember.computed(helper.get('relatedKey'), function () {
    helper.set('model', this);
    if (helper.needsProxy()) {
      helper.createProxy();
    }
    return helper[helper.get('proxyName')];
  });
}
