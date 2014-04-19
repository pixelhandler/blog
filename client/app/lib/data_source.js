'use-strict';

require('./socket-source');
var SCHEMA = require('../schema');

// need to throw error when memorySource comes up empty using _filter
OC.MemorySource.prototype._super_filter = OC.MemorySource.prototype._filter;
OC.MemorySource.prototype._filter = function (type, query) {
  var all = OC.MemorySource.prototype._super_filter.call(this, type, query);
  if (all.length === 0) {
    throw new Error('OC.MemorySource#_filter result is empty!');
  }
};

function DataSource() {}

DataSource.create = function () {
  if (typeof window.OC === 'undefined') {
    throw new Error('Orbit Common client library not loaded');
  }
  var schema = new OC.Schema({ idField: 'id', models: SCHEMA });

  var memorySource = new OC.MemorySource(schema);
  var localSource = new OC.LocalStorageSource(schema);
  var socketSource = new OC.SocketSource(schema);

  //var memoryToLocalRequestConnector = new Orbit.RequestConnector(
      //memorySource, localSource, {
        //actions: ['find'], mode: 'rescue'
      //}
  //);
  //var localToSocketRequestConnector = new Orbit.RequestConnector(
      //localSource, socketSource, {
        //actions: ['find'], mode: 'rescue'
      //}
  //);

  // Connect socketSource -> memorySource (using the default blocking strategy)
  var socketToMemoryConnector = new Orbit.TransformConnector(socketSource, memorySource);
  //var localToMemoryConnector = new Orbit.TransformConnector(localSource, memorySource);
  //var socketToLocalConnector = new Orbit.TransformConnector(socketSource, localSource);

  // Strategy to find records
  memorySource.on('rescueFind', socketSource.find);
  //socketSource.on('assistFind', localSource.find);
  //localSource.on('rescueFind', socketSource.find);

  return memorySource;
};

module.exports = DataSource;
