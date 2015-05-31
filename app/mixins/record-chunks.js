import Ember from 'ember';

export default Ember.Mixin.create({
  /*
    Prototype using mixin must define resourceName and controllerName, the
    controller must also be defined, can't rely on auto generation

    @prop {String} resourceName - name of record type used to lookup via store
    @prop (String) controllerName - name of controller to set `hasMore` flag on
  */
  serviceName: Ember.required,

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
    if (!this.refreshing && this.get('offset') > 0) {
      return;
    }
    this.set('offset', this.get('offset') + this.get('limit'));
  },

  model() {
    const query = { query: this.buildQuery() };
    return this.store.find(this.get('serviceName'), query);
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
    this.refreshing = false;
    const ids = collection.mapBy('id');
    const loaded = this.get('loadedIds');
    if (loaded.get('length') === 0) {
      loaded.pushObjects(ids);
    } else {
      const more = [];
      for (let i = 0; i < ids.length; i++) {
        if (loaded.indexOf(ids[i]) === -1) {
          more.push(ids[i]);
        }
      }
      loaded.pushObjects(more);
    }
    return collection;
  },

  setupController(controller, collection) {
    controller.setProperties({
      'hasMore': this.get('hasMore'),
      'loadingMore': false
    });
    collection = this.buildCollection();
    this._super(controller, collection);
  },

  sortBy: 'date',
  order: 'desc',

  buildCollection() {
    const data = this.store.all(this.get('serviceName'));
    const ids = this.get('loadedIds');
    const collection = data.filter(function (record) {
      return (ids.indexOf(record.get('id')) > -1);
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

  meta: Ember.computed('serviceName', function () {
    return this[this.get('serviceName')].get('cache.meta.page');
  }),

  actions: {
    showMore() {
      this.refreshing = true;
      this.refresh();
    }
  }
});
