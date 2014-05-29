'use-strict';

require('../../mixins/reset_scroll_mixin');

module.exports = App.AdminIndexRoute = Ember.Route.extend(App.ResetScroll, {
  model: function () {
    return this.store.find('post');
  },
  actions: {
    destroy: function (model) {
      model.destroyRecord();//.then(function () { model.unloadRecord(); });
    }
  }
});
