import Ember from 'ember';

export default Ember.Mixin.create({
  /**
    Prototype using mixin must define resourceName and controllerName, the
    controller must also be defined, can't rely on auto generation

    @prop {String} resourceName - name of record type used to lookup via store
    @prop (String) controllerName - name of controller to set `hasMore` flag on
  **/
  resourceName: null,

  /**
    Prototype using mixin may redefine limit and offset as needed.
  **/
  limit: 5,
  offset: -5,

  beforeModel: function () {
    this.set('offset', this.get('offset') + this.get('limit'));
  },

  model: function () {
    var query = { offset: this.get('offset'), limit: this.get('limit') };
    return this.store.find(this.get('resourceName'), query);
  },

  afterModel: function (collection) {
    this.set('meta', this.store.metadataFor(this.get('resourceName')));
    var loaded = this.get('loadedIds');
    collection.mapBy('id').forEach(function (id) {
      loaded.push(id);
    });
    this.set('loadedIds', loaded.uniq());
    return collection;
  },

  meta: null,
  loadedIds: [],

  setupController: function (controller) {
    var collection = [];
    this.get('loadedIds').forEach(function (id) {
      var model = this.store.getById(this.get('resourceName'), id);
      if (model) {
        collection.push(model);
      }
    }.bind(this));
    controller.setProperties({
      'hasMore': this.get('hasMore'),
      'loadingMore': false
    });
    this._super(controller, collection);
  },

  hasMore: function () {
    return this.get('loadedIds').length < this.get('meta.total');
  }.property('meta.total').volatile()
});
