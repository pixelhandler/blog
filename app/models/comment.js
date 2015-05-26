//import Ember from 'ember';
import Model from 'pixelhandler-blog/models/base';
import { attr } from 'pixelhandler-blog/models/base'; // , related

export default Model.extend({
  type: 'comment',

  body: attr(),
/*
  commenter: hasOne('commenter', { inverse: 'comments' }),
  post: hasOne('post', { inverse: 'comments' })
*/
});
