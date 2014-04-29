'use-strict';

module.exports = App.AdminEditRoute = Ember.Route.extend({
  model: function (params) {
    return this.dataSource.find('post', params.edit_id);
  },

  actions: {
    save: function () {
      this.modelFor(this.get('routeName')).save().then(function (model) {
        this.transitionTo('admin');
      }.bind(this));
    },

    cancel: function () {
      // TODO create model w/ rollback
      // this.modelFor(this.get('routeName')).rollback();
      this.transitionTo('admin.index');
    }
  }
});
