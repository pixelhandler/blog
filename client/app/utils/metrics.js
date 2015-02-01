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
  measure(name, 'navigationStart', markName);
  var measurements = window.performance.getEntriesByName(name);
  console.warn(name, measurements[0]);
  //return post(measurements[0]);
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
  var payload = {
    date: Date.now(),
    name: measurement.name,
    startTime: Math.round(measurement.startTime),
    duration: Number(Math.round(measurement.duration + 'e3') + 'e-3'), // round to thousandths
    pathname: location.pathname,
    ember: Ember.VERSION,
    version: config.APP.version,
    adapter: (config.APP.USE_SOCKET_ADAPTER)? 'SOCKET' : 'JSONAPI'
  };
  return Ember.$.ajax({
    type: 'POST',
    url: '/api/metrics',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({ metrics: payload }),
    dataType: 'json'
  });/*.done(function(data, staus, xhr) { console.log(data, staus, xhr); })
    .fail(function(xhr, status, error) { console.log(xhr, status, error); });*/
}

function clear() {
  window.performance.clearMarks();
  window.performance.clearMeasures();
}
