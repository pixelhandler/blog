'use-strict';

module.exports = App.IndexRoute = Ember.Route.extend({

  model: function () {
    return this.dataSource.find('post');
  },

  actions: {
    showMore: function () {}
  }

});
