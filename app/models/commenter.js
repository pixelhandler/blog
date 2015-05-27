import Model from 'pixelhandler-blog/models/base';
import { attr, hasMany } from 'pixelhandler-blog/models/base';

export default Model.extend({
  type: 'commenter',

  username: attr(),
  email: attr(),

  comments: hasMany('comments')
});
