import EO from "ember-orbit";

const attr = EO.attr;
const hasMany = EO.hasMany;

export default EO.Model.extend({
  name: attr('string'),
  email: attr('string'),

  posts: hasMany('post', {inverse: 'author'})
});
