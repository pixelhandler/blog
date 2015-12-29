import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      const found = this.store.all('tags').filter(function (tag) {
        return tag.get('slug') === params.tag_slug;
      });
      if (found.get('length') > 0) {
        resolve(found[0]);
      } else {
        const query = { id: params.tag_slug, query: { include: 'tags' } };
        this.store.find('tags', query).then(
          function (tag) {
            resolve(tag);
          },
          function (error) {
            reject(error);
          }
        );
      }
    }.bind(this));
  },

  serialize(model) {
    return { tag_slug: model.get('slug') };
  }
});
