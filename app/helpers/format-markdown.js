import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(input/*, options*/) {
  if (!input) { return ''; }
  const html = window.showdown.makeHtml(input);
  return new Ember.Handlebars.SafeString(html);
});
