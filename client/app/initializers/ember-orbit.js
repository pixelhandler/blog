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
    application.register('store:main', EO.Store);
    application.register('store:jsonApi', JSONAPIStore);
    connectSources(container);

    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
};

function connectSources(container) {
  var memorySource = container.lookup('store:main').orbitSource;
  var jsonApiSource = container.lookup('store:jsonApi').orbitSource;
  // Connect memorySource -> jsonApiSource (using default blocking strategy)
  setupConnectors(memorySource, jsonApiSource);

  logTransforms(memorySource, 'store:main');
  logTransforms(jsonApiSource, 'store:jsonApi');
}

function setupConnectors(primary, secondary) {
  new Orbit.TransformConnector(primary, secondary);
  new Orbit.TransformConnector(secondary, primary);
  primary.on('assistFind', secondary.find);
}

function logTransforms(source, name) {
  source.on('didTransform', function(operation) {
    console.log('[ORBIT.JS] [' + name + ']', operation);
  });
}
