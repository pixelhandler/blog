'use-strict';

module.exports = App.AdminIndexRoute = Ember.Route.extend({
  model: function () {
    return this.dataSource.find('post');
  },
  actions: {
    destroy: function (model) {
      this.dataSource.remove('post', model.id).then(function (model) {
        this.transitionTo('admin');
      }.bind(this));
    }
  }
});
