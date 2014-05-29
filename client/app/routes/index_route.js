'use-strict';

require('../mixins/record_chunks_mixin');
require('../mixins/reset_scroll_mixin');

module.exports = App.IndexRoute = Ember.Route.extend(
    App.RecordChunksMixin, App.ResetScroll, {

  resourceName: 'post',

  actions: {
    showMore: function () {
      this.refresh();
    }
  }

});
