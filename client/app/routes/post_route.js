'use-strict';

module.exports = App.PostRoute = Ember.Route.extend({
  model: function (params) {
    return this.store.find('post', params.post_id);
  }
});
