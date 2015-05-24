export default {
  name: 'ajax-defaults',

  initialize(/* registry, app */) {
    // Use credentials for session cookies
    Ember.$.ajaxPrefilter(function(options) {
      options.xhrFields = { withCredentials: true };
      options.beforeSend = function (xhr) {
        xhr.setRequestHeader('Authorization', window.localStorage.getItem('AuthorizationHeader'));
      };
    });
  }
};
