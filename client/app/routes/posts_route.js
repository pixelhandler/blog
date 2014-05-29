'use-strict';

require('../mixins/reset_scroll_mixin');

module.exports = App.PostsRoute = Ember.Route.extend(App.ResetScroll);
