import EO from "ember-orbit";
import hasOneProxy from "../utils/has-one-proxy";

var attr = EO.attr;

export default EO.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  // ID for related author is expected in the JSON payload
  author_id: attr(),

  // Computed property which manages related promise proxy object
  author: hasOneProxy('author')
});
