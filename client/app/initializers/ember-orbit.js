import Orbit from 'orbit';
import EO from 'ember-orbit';
//import LocalStorageSource from 'orbit-common/local-storage-source';
import ApplicationSerializer from '../serializers/application';
import SocketSource from '../adapters/socket-source';
import Ember from 'ember';

var SocketStore = EO.Store.extend({
  orbitSourceClass: SocketSource,
  orbitSourceOptions: {
    host: PixelhandlerBlogENV.API_HOST,
    defaultSerializerClass: ApplicationSerializer
  }
});

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
    application.register('store:socket', SocketStore);
    //application.register('store:local', LocalStore);
    connectSources(container);

    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
};

function connectSources(container) {
  var memorySource = container.lookup('store:main').orbitSource;
  var socketSource = container.lookup('store:socket').orbitSource;
  //var localSource = container.lookup('store:local').orbitSource;
  // Connect (using default blocking strategy)
  setupConnectors(memorySource, socketSource/*, localSource*/);

  logTransforms(memorySource, 'store:main');
  logTransforms(socketSource, 'store:socket');
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
