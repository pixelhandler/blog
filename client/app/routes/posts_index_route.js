'use-strict';

var get = Ember.get, set = Ember.set;

module.exports = App.PostsIndexRoute = Ember.Route.extend({

  model: function () {
    return this.memorySource.find('post');
  },

  actions: {
    showMore: function () {
      //this.refresh();
    }
  }
});
