'use-strict';

module.exports = App.AdminIndexRoute = Ember.Route.extend({
  model: function () {
    return this.dataSource.find('post');
  },
  actions: {
    destroy: function (model) {
      //model.destroyRecord();//.then(function () { model.unloadRecord(); });
      // TODO remove record
    }
  }
});
