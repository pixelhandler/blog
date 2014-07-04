import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

var PostRoute = Ember.Route.extend(ResetScroll, {
  model: function (params) {
    // TODO FIX Orbit initializer, 
    // return this.store.find('post', params.post_id);
    return Ember.$.get(PixelhandlerBlogENV.API_HOST + '/posts/' + params.post_id);
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.setProperties({
      'disqusId': model.get('id'),
      'disqusUrl': getUrl(this/*, model*/),
      'disqusTitle': model.get('title')
    });
  }
});

function getUrl(route/*, model*/) {
  var name = route.routeName;
  var loc = window.location;
  return [
    loc.protocol, '//', loc.host, '/',
    route.routeName.pluralize(), '/',
    route.router.router.state.params[name][name + '_id']
  ].join('');
}

export default PostRoute;
