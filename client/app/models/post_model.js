'use-strict';

var attr = DS.attr;

module.exports = App.PostModel = DS.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  author: attr(),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string')
});
