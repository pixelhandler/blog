import EO from "ember-orbit";

var attr = EO.attr;

export default EO.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  author: attr(),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string')
});
