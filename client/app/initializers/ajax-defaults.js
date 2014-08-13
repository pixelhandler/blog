export default {
  name: 'ajax-defaults',

  initialize: function(/* container, app */) {
    // Use credentials for session cookies
    Ember.$.ajaxPrefilter(function(options) {
      options.xhrFields = { withCredentials: true };
    });
  }
};
