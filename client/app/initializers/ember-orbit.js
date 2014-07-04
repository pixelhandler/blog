Orbit.Promise = Ember.RSVP.Promise;
Orbit.ajax = Ember.$.ajax;

/* TODO FIX Error: Assertion Failed: Source.orbitSourceClass must be initialized with an instance of an `OC.Source`
var JSONAPIStore = EO.Store.extend({
  orbitSourceClass: OC.JSONAPISource,
  orbitSourceOptions: {
    host: PixelhandlerBlogENV.API_HOST,
    namespace: PixelhandlerBlogENV.API_PATH,
    idField: 'id'
  }
  //orbitSourceClass: new OC.JSONAPISource({
    //idField: 'id',
    //host: PixelhandlerBlogENV.API_HOST,
    //namespace: PixelhandlerBlogENV.API_PATH
  //}),
});
*/
export default {
  name: 'ember-orbit',

  initialize: function(/*container, application*/) {
    /* TODO FIX Error: Assertion Failed: Source.orbitSourceClass must be initialized with an instance of an `OC.Source`
    application.register('schema:main', EO.Schema);
    //application.register('store:main', EO.Store);
    application.register('store:main', JSONAPIStore);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
    */
  }
};
