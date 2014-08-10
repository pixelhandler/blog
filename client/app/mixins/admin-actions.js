import Ember from 'ember';

export default Ember.Mixin.create({
  onDidAdd: function () {
    var _this = this;
    this.store.orbitSource.on('didAdd', function () {
      _this.transitionToAdminIndex();
    });
  }.on('init'),

  //onDidRemove: function () {
    //var _this = this;
    //this.store.orbitSource.on('didRemove', function () {
      //_this.transitionToAdminIndex();
    //});
  //}.on('init'),

  transitionToAdminIndex: function () {
    if (this.inFlight) {
      this.transitionTo('admin.index');
      this.inFlight = false;
    }
  },

  actions: {
    save: function () {
      var model = this.modelFor(this.get('routeName'));
      var type = model.resourceName;
      this.inFlight = true;
      this.store.add(type, model.toJSON()).then(function (data) {
        // TODO figure out after add, fixup ID, add to application and index routes' models
        debugger;
      });
    },

    cancel: function () {
      this.transitionTo('admin.index');
    },

    destroy: function (id) {
      var type = this.get('resourceName');
      //this.inFlight = true;
      this.store.remove(type, id).then(function () {
        this.preventScroll = true;
        this.refresh();
      }.bind(this));
    }
  }
});
