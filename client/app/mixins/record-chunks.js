import Ember from 'ember';

export default Ember.Mixin.create({
  /*
    Prototype using mixin must define resourceName and controllerName, the
    controller must also be defined, can't rely on auto generation

    @prop {String} resourceName - name of record type used to lookup via store
    @prop (String) controllerName - name of controller to set `hasMore` flag on
  */
  resourceName: Ember.required,

  /*
    Prototype using mixin may redefine limit and offset as needed.
  */
  limit: 5,
  offset: -5,
  sortParams: '-date,-id',

  initLoadedIds: function () {
    this.set('loadedIds', Ember.ArrayProxy.create({content: Ember.A([])}));
  }.on('init'),

  beforeModel() {
    this.set('offset', this.get('offset') + this.get('limit'));
  },

  model: function () {
    var query = this.buildQuery();
    return this.store.find(this.get('resourceName'), query);
  },

  buildQuery: function () {
    var params = this.getProperties('offset', 'limit', 'sortParams');
    return {
      'sort': params.sortParams,
      'page[offset]': params.offset,
      'page[limit]': params.limit
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
    return this.store.all(type).filter(function (record) {
      return ids.contains(record.get('id'));
    });/*.sortBy(this.get('sortBy'));
    if (this.get('order') === 'desc') {
      collection.reverse();
    }*/
  },

  hasMore: function () {
    var total = this.get('meta.total');
    if (Ember.isEmpty(total)) {
      return false;
    }
    return this.get('loadedIds').get('length') < total;
  }.property('loadedIds', 'total').volatile(),

  meta: Ember.computed('resourceName', function () {
    var type = this.get('resourceName');
    if (!this.store.schema._schema.meta) {
      return null;
    }
    return this.store.schema._schema.meta.get(type);
  })
});
