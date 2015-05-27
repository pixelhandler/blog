import Model from 'pixelhandler-blog/models/base';
import { attr, hasMany } from 'pixelhandler-blog/models/base';

export default Model.extend({
  type: 'author',

  name: attr(),
  email: attr(),

  posts: hasMany('posts')
});
