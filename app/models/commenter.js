import EO from 'ember-orbit';

const attr = EO.attr;
const hasMany = EO.hasMany;

export default EO.Model.extend({
  type: 'commenter',

  username: attr('string'),
  email: attr('string'),

  comments: hasMany('comment', { inverse: 'commenter' })
});
