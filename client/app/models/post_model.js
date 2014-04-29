'use-strict';

module.exports = App.PostModel = Ember.Model.extend({
  __type__: 'post',
  slug: void 0,
  title: void 0,
  author: void 0,
  date: void 0,
  excerpt: void 0,
  body: void 0
});
