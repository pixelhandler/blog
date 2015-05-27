import Model from 'pixelhandler-blog/models/base';
import { attr, hasOne } from 'pixelhandler-blog/models/base';

export default Model.extend({
  type: 'comment',

  body: attr(),

  commenter: hasOne('commenter'),
  post: hasOne('post')
});
