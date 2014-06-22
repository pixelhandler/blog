import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(input/*, options*/) {
  if (!input) { return ''; }
  var html = window.showdown.makeHtml(input);
  return new Handlebars.SafeString(html);
});
