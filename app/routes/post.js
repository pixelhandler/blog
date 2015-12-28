import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      const found = this.store.all('posts').filter(function (post) {
        return post.get('slug') === params.post_slug;
      });
      if (found.get('length') > 0) {
        resolve(found[0]);
      } else {
        const query = { id: params.post_slug, query: { include: 'author,comments' } };
        this.store.find('posts', query).then(
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

