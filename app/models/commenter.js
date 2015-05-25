import Ember from 'ember';
import Model from 'pixelhandler-blog/models/base';

export default Model.extend({
  type: 'commenter',
/*
  username: attr('string'),
  email: attr('string'),

  comments: hasMany('comment', { inverse: 'commenter' })
*/
});
