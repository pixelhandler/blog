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
    // TODO FIXUP set meta somewhere in ember-orbit model?
    // var meta = this.store.metadataFor(this.get('resourceName'));
    // this.set('meta', meta);
    // begin: remove after FIXUP
    collection = collection.posts || collection;
    this._map = this._map || Ember.Map.create();
    collection.forEach(function(item) {
      this._map.set(item.id, item);
    }.bind(this));
    // end: removal
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
      var model = this.store.retrieve(this.get('resourceName'), id);
      // TODO REVIEW any meta data needed
      // begin: remove after FIXUP
      // var model = this._map.get(id);
      // end: removal
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
