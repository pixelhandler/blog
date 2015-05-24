import Ember from "ember";

var ArrayProxy = Ember.ArrayProxy;
var PromiseProxyMixin = Ember.PromiseProxyMixin;
var get = Ember.get;

var HasManyProxyHelper = Ember.Object.extend({
  init: function () {
    this._super();
    if (typeof get(this, 'resource') !== 'string') {
      throw new Error('HasManyProxyHelper#init expects `resource` property to exist.');
    }
    this[get(this, 'proxyName')] = null;
    return this;
  },

  // model instance as reference for related ids
  // expected to have foreign key as a property, e.g. `post_ids: ['id',...]` 
  model: null,

  relatedKey: function () {
    return "%@_ids".fmt(get(this, 'resource'));
  }.property('resource'),

  /**
   @property {Array} relatedIds: list of ids for related records
  */
  relatedIds: function () {
    var key = get(this, 'relatedKey');
    var model = get(this, 'model');
    return get(model, key);
  }.property('relatedKey', 'model'),

  /**
   @property {String} ids: cache of related ids (comma separated)
  */
  ids: null,

  proxyName: function () {
    return "_%@Proxy".fmt(get(this, 'resource'));
  }.property('resource'),

  needsProxy: function () {
    var proxy = this[get(this, 'proxyName')];
    return proxy === null || get(this, 'ids') !== get(this, 'relatedIds').join(',');
  },

  createProxy: function () {
    var relatedIds = get(this, 'relatedIds');
    var model = get(this, 'model');
    var proxy = ArrayProxy.extend(PromiseProxyMixin, {
      promise: model.store.find(get(this, 'resource'), relatedIds)
    });
    var proxyProp = proxy.create();
    proxyProp.then(
      function (relatedModels) {
        this[get(this, 'proxyName')].setProperties({
          'content': relatedModels,
          'ids': relatedIds.join(',')
        });
      }.bind(this),
      function (error) {
        console.log(error);
      }
    );
    this[get(this, 'proxyName')] = proxyProp;
  }
});

/**
  hasManyProxy helper is based on a computed property that manages a promise proxy
  object, it encapsulates the work to find related models (1:n)
  // Not using ember-orbit relations, `posts: EO.hasMany('post')`
  // Instead use a computed property with proxy array
  posts: Ember.computed('post_ids', function () {
    var ids = this.get('post_ids');
    if (this._postsProxy === null || this._postsProxy.get('ids') !== ids.join(',')) {
      var proxy = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin, {
        promise: this.store.find('post', ids)
      });
      this._postsProxy = proxy.create();
      this._postsProxy.then(
        function (posts) {
          this._postsProxy.set('content', posts);
          this._postsProxy.set('ids', ids.join(','));
        }.bind(this),
        function (error) { console.log(error); }
      );
    }
    return this._postsProxy;
  }).meta({type: 'post'}),
*/
export default function hasManyProxy(resource) {
  var helper = HasManyProxyHelper.create({'resource': resource});
  return Ember.computed(helper.get('relatedKey'), function () {
    helper.set('model', this);
    if (helper.needsProxy()) {
      helper.createProxy();
    }
    return helper[helper.get('proxyName')];
  });
}
