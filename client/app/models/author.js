import EO from "ember-orbit";

var attr = EO.attr;
var hasMany = EO.hasMany;

export default EO.Model.extend({
  name: attr('string'),
  email: attr('string'),

  posts: hasMany('post')
  //posts: attr() // array of IDs for related posts
});