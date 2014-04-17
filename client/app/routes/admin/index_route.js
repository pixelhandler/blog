'use-strict';

module.exports = App.AdminIndexRoute = Ember.Route.extend({
  model: function () {
    return this.memorySource.find('post');
  },
  actions: {
    destroy: function (model) {
      model.destroyRecord();//.then(function () { model.unloadRecord(); });
    }
  }
});
