'use-strict';

var attr = EO.attr;

module.exports = App.PostModel = EO.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  author: attr(),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string')
});
