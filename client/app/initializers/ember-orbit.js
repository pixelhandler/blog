import Orbit from 'orbit';
import EO from 'ember-orbit';
//import LocalStorageSource from 'orbit-common/local-storage-source';
import JSONAPISource from 'orbit-common/jsonapi-source';
import ApplicationSerializer from '../serializers/application';
//import SocketSource from '../adapters/socket-source';
import Ember from 'ember';

Orbit.Promise = Orbit.Promise || Ember.RSVP.Promise;

function jsonApiStore() {
  Orbit.ajax = Ember.$.ajax;
  return EO.Store.extend({
    orbitSourceClass: JSONAPISource,
    orbitSourceOptions: {
      host: PixelhandlerBlogENV.API_HOST,
      namespace: PixelhandlerBlogENV.API_PATH,
      defaultSerializerClass: ApplicationSerializer
    }
  });
}
/*
function socketStore() {
  return EO.Store.extend({
    orbitSourceClass: SocketSource,
    orbitSourceOptions: {
      host: PixelhandlerBlogENV.SOCKET_URL,
      defaultSerializerClass: ApplicationSerializer
    }
  });
}
*/
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

export default {
  name: 'ember-orbit',
  after: 'socket',

  initialize: function(container, application) {
    application.register('schema:main', Schema);
    application.register('store:main', EO.Store);
    //if (notPrerenderService() && canUseSocket(container)) {
      //application.register('store:secondary', socketStore());
    //} else {
      application.register('store:secondary', jsonApiStore());
    //}
    //application.register('store:local', LocalStore);
    connectSources(container);

    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
};
/*
function notPrerenderService() {
  return window.navigator.userAgent.match(/Prerender/) === null;
}

function canUseSocket(container) {
  return window.WebSocket && container.lookup('socket:main');
}
*/
function connectSources(container) {
  var primarySource = container.lookup('store:main').orbitSource;
  var secondarySource = container.lookup('store:secondary').orbitSource;
  //var localSource = container.lookup('store:local').orbitSource;
  // Connect (using default blocking strategy)
  setupConnectors(primarySource, secondarySource/*, localSource*/);

  logTransforms(primarySource, 'store:main');
  logTransforms(secondarySource, 'store:secondary');
  //logTransforms(localSource, 'store:local');
}

function setupConnectors(primary, secondary/*, local*/) {
  new Orbit.TransformConnector(primary, secondary);
  new Orbit.TransformConnector(secondary, primary);
  // TODO figure out how to add a third store for localStorage
  //new Orbit.TransformConnector(secondary, local);
  primary.on('assistFind', secondary.find);
}

function logTransforms(source, name) {
  source.on('didTransform', function(operation) {
    console.log('[ORBIT.JS] [' + name + ']', operation);
  });
}
