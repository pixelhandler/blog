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
  sortParams: '-date',

  initLoadedIds: function () {
    this.set('loadedIds', Ember.ArrayProxy.create({content: Ember.A([])}));
  }.on('init'),

  beforeModel() {
    this.set('offset', this.get('offset') + this.get('limit'));
  },

  model() {
    const query = this.buildQuery();
    return this[this.get('resourceName')].find(query);
  },

  buildQuery() {
    const params = this.getProperties('offset', 'limit', 'sortParams');
    return {
      'sort': params.sortParams,
      'page[offset]': params.offset,
      'page[limit]': params.limit
    };
  },

  afterModel(collection) {
    const ids = collection.mapBy('id');
    this.get('loadedIds').pushObjects(ids);
    return collection;
  },

  setupController(controller) {
    controller.setProperties({
      'hasMore': this.get('hasMore'),
      'loadingMore': false
    });
    const collection = this.buildCollection();
    this._super(controller, collection);
  },

  sortBy: 'date',
  order: 'desc',

  buildCollection() {
    const type = this.get('resourceName');
    const ids = this.get('loadedIds');
    const collection = this[type].cache.resources.filter(function (record) {
      return ids.contains(record.get('id'));
    }).sortBy(this.get('sortBy'));
    if (this.get('order') === 'desc') {
      collection.reverse();
    }
    return collection;
  },

  hasMore: function () {
    const total = this.get('meta.total');
    if (Ember.isEmpty(total)) {
      return false;
    }
    return this.get('loadedIds').get('length') < total;
  }.property('loadedIds', 'total').volatile(),

  meta: Ember.computed('resourceName', function () {
    return this[this.get('resourceName')].cache.meta.page;
  })
});
