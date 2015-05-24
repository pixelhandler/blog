import EO from 'ember-orbit';

const attr = EO.attr;
const hasOne = EO.hasOne;

export default EO.Model.extend({
  type: 'comment',

  body: attr('string'),

  commenter: hasOne('commenter', { inverse: 'comments' }),
  post: hasOne('post', { inverse: 'comments' })
});
