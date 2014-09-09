import EO from "ember-orbit";
//import hasManyProxy from "../utils/has-many-proxy";
import { uuid } from "../utils/uuid";

var attr = EO.attr;
var key = EO.key;
var hasMany = EO.hasMany;

export default EO.Model.extend({
  id: key({primaryKey: true, defaultValue: uuid}),
  name: attr('string'),
  email: attr('string'),

  // IDs for related posts is expected in the JSON payload
  //post_ids: attr(),

  // Computed property which manages related promise proxy object
  //posts: hasManyProxy('post')
  posts: hasMany('post', {inverse: 'author'})
});
