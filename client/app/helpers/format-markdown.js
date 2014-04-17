'use-strict';

Ember.Handlebars.helper('format-markdown', function(input) {
  if (!input) return '';
  var html = window.showdown.makeHtml(input);
  return new Handlebars.SafeString(html);
});
