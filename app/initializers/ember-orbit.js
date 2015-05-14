import Orbit from 'orbit';
import EO from 'ember-orbit';
//import LocalStorageSource from 'orbit-common/local-storage-source';
import ApplicationSource from '../adapters/application';
import ApplicationSerializer from '../serializers/application';
import Ember from 'ember';
import config from '../config/environment';

Orbit.Promise = Orbit.Promise || Ember.RSVP.Promise;

function jsonApiStore() {
  Orbit.ajax = Ember.$.ajax;
  return EO.Store.extend({
    orbitSourceClass: ApplicationSource,
    orbitSourceOptions: {
      host: config.APP.API_HOST,
      namespace: config.APP.API_PATH,
      SerializerClass: ApplicationSerializer,
      usePatch: false,
    }
  });
}

//var LocalStore = EO.Store.extend({
  //orbitSourceClass: LocalStorageSource
//});

var Schema = EO.Schema.extend({
  idField: 'id',

  init: function (options) {
    this._super(options);
    this._schema.meta = Ember.Map.create();
  }
});

export function initialize(registry, application) {
  application.register('schema:main', Schema);
  application.register('store:main', EO.Store);
  application.register('store:secondary', jsonApiStore());
  //application.register('store:local', LocalStore);

  application.inject('controller', 'store', 'store:main');
  application.inject('route', 'store', 'store:main');
}

export default {
  name: 'ember-orbit',
  initialize: initialize
};
