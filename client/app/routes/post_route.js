'use-strict';

module.exports = App.PostRoute = Ember.Route.extend({
  model: function (params) {
    return this.dataSource.find('post', params.post_id);
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    if (window.EmberENV.DISQUS_SHORTNAME) {
      controller.setProperties({
        'disqusId': model.get('id'),
        'disqusUrl': getUrl(this, model),
        'disqusTitle': model.get('title')
      });
    }
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
