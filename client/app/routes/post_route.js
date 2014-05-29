'use-strict';

require('../mixins/reset_scroll_mixin');

module.exports = App.PostRoute = Ember.Route.extend(App.ResetScroll, {
  model: function (params) {
    return this.store.find('post', params.post_id);
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.setProperties({
      'disqusId': model.get('id'),
      'disqusUrl': getUrl(this, model),
      'disqusTitle': model.get('title')
    });
  }
});

function getUrl(route, model) {
  var name = route.routeName;
  var loc = window.location;
  return [
    loc.protocol, '//', loc.host, '/',
    route.routeName.pluralize(), '/',
    route.router.router.state.params[name][name + '_id']
  ].join('');
}
