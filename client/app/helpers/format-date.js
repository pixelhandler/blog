import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(date/*, options*/) {
  return window.moment(date).format('YYYY-MM-DD');
});
