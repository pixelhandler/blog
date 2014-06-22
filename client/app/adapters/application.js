import DS from "ember-data";

export default DS.RESTAdapter.extend({
  host: PixelhandlerBlogENV.API_HOST,
  namespace: PixelhandlerBlogENV.API_PATH
});
