//import Ember from 'ember';
//import Orbit from 'orbit';
//import OC from 'orbit_common';
//import JSONAPISource from 'orbit_common/jsonapi_source';
//import EO from 'ember_orbit';

Orbit.Promise = Ember.RSVP.Promise;
Orbit.ajax = Ember.$.ajax;

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

export default {
  name: 'ember-orbit',

  initialize: function(container, application) {
    application.register('schema:main', EO.Schema);

    //application.register('store:main', EO.Store);
    application.register('store:main', JSONAPIStore);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
};
