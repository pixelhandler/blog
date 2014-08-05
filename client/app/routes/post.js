import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

var PostRoute = Ember.Route.extend(ResetScroll, {
  model: function (params) {
    return this.store.find('post', { id: params.post_id });
  },

  serialize: function (model) {
    return { post_id: model.get('id') };
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.setProperties({
      'disqusId': model.get('slug') || model.get('id'), // TODO use getter after Orbit FIXUP
      'disqusUrl': getUrl(this/*, model*/),
      'disqusTitle': model.title || model.get('title') // TODO use getter after Orbit FIXUP
    });
  }
});

function getUrl(route/*, model*/) {
  var name = route.routeName;
  var loc = window.location;
  return [
    loc.protocol, '//', loc.host, '/',
    'posts/',
    route.router.router.state.params[name][name + '_id']
  ].join('');
}

export default PostRoute;
