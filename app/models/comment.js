import Ember from 'ember';
import Model from 'pixelhandler-blog/models/base';

export default Model.extend({
  type: 'comment',
/*
  body: attr('string'),

  commenter: hasOne('commenter', { inverse: 'comments' }),
  post: hasOne('post', { inverse: 'comments' })
*/
});
