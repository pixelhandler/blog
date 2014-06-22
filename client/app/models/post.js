import DS from "ember-data";

var attr = DS.attr;

export default DS.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  author: attr(),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string')
});
