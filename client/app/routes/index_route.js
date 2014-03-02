'use-strict';

require('../mixins/record_chunks_mixin');

module.exports = App.IndexRoute = Ember.Route.extend(App.RecordChunksMixin, {

  resourceName: 'post',

  actions: {
    showMore: function () {
      this.refresh();
    }
  }

});
