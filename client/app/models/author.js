import EO from "ember-orbit";
import hasManyProxy from "../utils/has-many-proxy";

var attr = EO.attr;

export default EO.Model.extend({
  name: attr('string'),
  email: attr('string'),

  // IDs for related posts is expected in the JSON payload
  post_ids: attr(),

  // Computed property which manages related promise proxy object
  posts: hasManyProxy('post')
});
