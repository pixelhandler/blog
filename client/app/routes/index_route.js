'use-strict';

module.exports = App.IndexRoute = Ember.Route.extend({

  model: function () {
    return this.memorySource.find('post');
  },

  actions: {
    showMore: function () {}
  }

});
