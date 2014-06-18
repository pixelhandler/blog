'use-strict';

/**
  Globals
**/
//window.Orbit = require('orbit');
//window.OC = require('orbit_common');
//window.OC.JSONAPISource = require('orbit_common/jsonapi_source');
//window.EO = require('ember_orbit');

/**
  Initialize the application
**/
window.App = require('app');

require('router');

var loadOrder = [
  'lib', 'mixins', 'adapters', 'serializers', 'routes', 'models',
  'controllers', 'views', 'components', 'helpers', 'templates'
];

loadOrder.forEach(function(folder) {
  var list = window.require.list();

  var modules = list.filter(function (module) {
    var regex = new RegExp('^' + folder + '/');
    return regex.test(module);
  });

  modules.forEach(function(module) {
    window.require(module);
  });
});
