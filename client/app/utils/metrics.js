/*jshint unused:false*/
import Ember from 'ember';
import config from '../config/environment';

/*
  Facade for User Timing API for Web Peformance testing

  http://www.w3.org/TR/#tr_Web_Performance
  http://www.w3.org/TR/user-timing/#dom-performance-mark
  http://www.w3.org/TR/user-timing/#dom-performance-measure
  http://www.html5rocks.com/en/tutorials/webperformance/usertiming/
  http://caniuse.com/#search=performance
*/

export function mark(name) {
  if (!window.performance || !window.performance.mark ) { return; }
  window.performance.mark(name);
}

export function measure(name, begin, end) {
  if (!window.performance || !window.performance.measure ) { return; }
  window.performance.measure(name, begin, end);
}

export function appReady() {
  return measureEntry('app_ready');
}

export function appUnload() {
  return measureEntry('app_unload');
}

export function pageView() {
  return measureEntry('page_view');
}

function measureEntry(name) {
  if (!window.performance || !window.performance.getEntriesByName ) { return; }
  var markName = name + '_now';
  mark(markName);
  if (window.performance.timing) {
    measure(name, 'navigationStart', markName);
  } else {
    measure(name, markName, markName);
  }
  var measurements = window.performance.getEntriesByName(name);
  console.warn(name, measurements[0]);
}

export function report() {
  if (!window.performance || !window.performance.getEntriesByType ) { return; }
  window.setTimeout(function() {
    log(window.performance.getEntriesByType('measure'));
    clear();
  }, 1000);
}

function log(measurements) {
  var measurement;
  for (var i = 0; i < measurements.length; ++i) {
    measurement = measurements[i];
    console.warn(measurement.name + ' took ' + measurement.duration + ' milliseconds');
    console.table(measurement);
    post(measurement);
  }
}

export function post(measurement) {
  var payload = createMetric(measurement);
  return Ember.$.ajax({
    type: 'POST',
    url: endpointUri('metrics'),
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({ metrics: payload }),
    dataType: 'json'
  });/*.done(function(data, staus, xhr) { console.log(data, staus, xhr); })
    .fail(function(xhr, status, error) { console.log(xhr, status, error); });*/
}

function createMetric(measurement) {
  return {
    date: Date.now(),
    name: measurement.name,
    pathname: location.pathname,
    startTime: Math.round(measurement.startTime),
    duration: Number(Math.round(measurement.duration + 'e3') + 'e-3'), // round to thousandths
    visitor: window.localStorage.getItem('visitor'),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    screenColorDepth: window.screen.colorDepth,
    screenPixelDepth: window.screen.pixelDepth,
    screenOrientation: (window.screen.orientation) ? window.screen.orientation.type : null,
    blogVersion: config.APP.version,
    emberVersion: Ember.VERSION,
    adapterType: (config.APP.USE_SOCKET_ADAPTER) ? 'SOCKET' : 'JSONAPI'
  };
}

function endpointUri(resource) {
  var host = config.APP.API_HOST;
  var path = config.APP.API_PATH;
  var uri = (path) ? host + '/' + path : host;
  return uri + '/' + resource;
}

function clear() {
  window.performance.clearMarks();
  window.performance.clearMeasures();
}
