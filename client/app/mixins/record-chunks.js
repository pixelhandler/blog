import Ember from 'ember';

export default Ember.Mixin.create({
  /**
    Prototype using mixin must define resourceName and controllerName, the
    controller must also be defined, can't rely on auto generation

    @prop {String} resourceName - name of record type used to lookup via store
    @prop (String) controllerName - name of controller to set `hasMore` flag on
  **/
  resourceName: Ember.required,

  /**
    Prototype using mixin may redefine limit and offset as needed.
  **/
  limit: 5,
  offset: -5,

  /**
    Prototype using mixin may redefine limit and offset as needed.
    @prop {String} sortBy
  **/
  sortBy: Ember.required,

  /**
    @prop {String} order `desc` or `asc`; desc will reverse the sorted collection
  **/
  order: Ember.required,

  initLoadedIds: function () {
    this.set('loadedIds', Ember.ArrayProxy.create({content: Ember.A([])}));
  }.on('init'),

  beforeModel: function () {
    this.set('offset', this.get('offset') + this.get('limit'));
  },

  model: function () {
    var query = this.buildQuery();
    return this.store.find(this.get('resourceName'), query);
  },

  buildQuery: function () {
    return {
      offset: this.get('offset'),
      limit: this.get('limit'),
      sortBy: this.get('sortBy'),
      order: this.get('order')
    };
  },

  afterModel: function (collection) {
    var ids = collection.mapBy('id');
    this.get('loadedIds').pushObjects(ids);
    return collection;
  },

  setupController: function (controller) {
    controller.setProperties({
      'hasMore': this.get('hasMore'),
      'loadingMore': false
    });
    var collection = this.buildCollection();
    this._super(controller, collection);
  },

  buildCollection: function () {
    var type = this.get('resourceName');
    var ids = this.get('loadedIds');
    var collection = this.store.all(type).filter(function (record) {
      return ids.contains(record.get('id'));
    }).sortBy(this.get('sortBy'));
    if (this.get('order') === 'desc') {
      collection.reverse();
    }
    return collection;
  },

  hasMore: function () {
    var meta = this.get('meta');
    if (!meta) {
      return false;
    }
    return this.get('loadedIds').get('length') < meta.get('total');
  }.property('loadedIds', 'total').volatile(),

  meta: Ember.computed('resourceName', function () {
    var type = this.get('resourceName');
    if (!this.store.schema._schema.meta) {
      return null;
    }
    return this.store.schema._schema.meta.get(type);
  })
});
