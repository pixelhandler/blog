'use-strict';

Ember.Handlebars.helper('format-date-from-now', function(date) {
  return moment(date).fromNow();
});
