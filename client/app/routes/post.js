import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

var PostRoute = Ember.Route.extend(ResetScroll, {
  model: function (params) {
    return this.store.find('post', params.post_id);
    /* or with plain ajax...
    var _this = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var uri = PixelhandlerBlogENV.API_HOST + '/posts/' + params.post_id;
      Ember.$.get(uri).then(function (payload) {
        _this.set('meta', payload.meta);
        resolve(payload.posts[0]);
      }, function(error) {
        reject(error);
      });
    });
    */
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.setProperties({
      'disqusId': model.slug || model.get('id'), // TODO use getter after Orbit FIXUP
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
