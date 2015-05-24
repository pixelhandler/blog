import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      const found = this.store.filter('post', function (post) {
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

  serialize(model) {
    return { post_slug: model.get('slug') };
  },

  setupController(controller, model) {
    if (typeof model.toArray === 'function') {
      const filtered = model.toArray();
      model = (filtered.length) ? filtered[0] : model;
    }
    this._super(controller, model);
  },

  actions: {
    error(error) {
      Ember.Logger.error(error);
      this.transitionTo('/not-found');
    }
  }
});
