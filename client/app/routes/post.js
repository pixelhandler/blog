import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

var PostRoute = Ember.Route.extend(ResetScroll, {
  model: function (params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var found = this.store.filter('post', function (post) {
        return post.get('slug') === params.post_slug;
      });
      if (found.get('length') > 0) {
        resolve(found[0]);
      } else {
        this.store.find('post', params.post_slug).then(
          function (post) {
            resolve(post);
          },
          function (error) {
            reject(error);
          }
        );
      }
    }.bind(this));
  },

  serialize: function (model) {
    return { post_slug: model.get('slug') };
  },

  setupController: function (controller, model) {
    if (typeof model.toArray === 'function') {
      var filtered = model.toArray();
      model = (filtered.length) ? filtered[0] : model;
    }
    this._super(controller, model);
    controller.setProperties({
      'disqusId': model.get('slug') || model.get('id'), // TODO use getter after Orbit FIXUP
      'disqusUrl': getUrl(this/*, model*/),
      'disqusTitle': model.title || model.get('title') // TODO use getter after Orbit FIXUP
    });
  },

  actions: {
    error: function (error) {
      Ember.Logger.error(error);
      this.transitionTo('/not-found');
    }
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
