import Orbit from 'orbit';
import EO from 'ember-orbit';
import JSONAPISource from 'orbit-common/jsonapi-source';

Orbit.Promise = Ember.RSVP.Promise;
Orbit.ajax = Ember.$.ajax;

var Schema = EO.Schema.extend({
  idField: 'id'
});

var JSONAPIStore = EO.Store.extend({
  orbitSourceClass: JSONAPISource,
  orbitSourceOptions: {
    host: PixelhandlerBlogENV.API_HOST,
    namespace: PixelhandlerBlogENV.API_PATH
  }
});

export default {
  name: 'ember-orbit',

  initialize: function(container, application) {
    application.register('schema:main', Schema);
    application.register('store:main', JSONAPIStore);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
};
