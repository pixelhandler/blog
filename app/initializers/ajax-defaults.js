/* globals process */
import Ember from 'ember';

export function initialize(/* application */) {
  if (!Ember.$ || typeof process !== 'undefined') { return; }
  Ember.$.ajaxPrefilter(function(options) {
    options.xhrFields = { withCredentials: true };
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', window.localStorage.getItem('AuthorizationHeader'));
    };
  });
}

export default {
  name: 'ajax-defaults',
  initialize
};
