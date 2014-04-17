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

function MemorySource() {}

MemorySource.create = function () {
  if (typeof window.OC === 'undefined') {
    throw new Error('Orbit Common client library not loaded');
  }
  var schema = new OC.Schema({ idField: 'id', models: SCHEMA });
  var memorySource = new OC.MemorySource(schema);
  //var localSource = new OC.LocalStorageSource(schema);
  var socketSource = new OC.SocketSource(schema);

  // Connect memorySource -> localSource (using the default blocking strategy)
  var socketToMemoryConnector = new Orbit.TransformConnector(socketSource, memorySource);

  // Connect memorySource -> localSource (using the default blocking strategy)
  //var memToLocalConnector = new Orbit.TransformConnector(memorySource, localSource);

  // Check local storage before making a remote call
  //socketSource.on('assistFind', localSource.find);

  // If the in-memory source can't find the record, query our rest server
  memorySource.on('rescueFind', socketSource.find);

  return memorySource;
};

module.exports = MemorySource;
