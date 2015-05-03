import EO from 'ember-orbit';

var attr = EO.attr;

export default EO.Model.extend({
  date: attr('date'),
  name: attr('string'),
  emberVersion: attr('string'),
  pathname: attr('string'),
  duration: attr('number'),
  userAgent: attr('string')
});
