'use-strict';

require('../../mixins/reset_scroll_mixin');

module.exports = App.AdminEditRoute = Ember.Route.extend(App.ResetScroll, {
  model: function (params) {
    return this.store.find('post', params.edit_id);
  },

  actions: {
    save: function () {
      this.modelFor(this.get('routeName')).save().then(function (model) {
        this.transitionTo('admin');
      }.bind(this));
    },

    cancel: function () {
      this.modelFor(this.get('routeName')).rollback();
      this.transitionTo('admin.index');
    }
  }
});
