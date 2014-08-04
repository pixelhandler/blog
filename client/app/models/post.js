import EO from "ember-orbit";

var attr = EO.attr;
var hasOne = EO.hasOne;

export default EO.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  author: hasOne('author')
  //author: attr() // ID for related author
});
