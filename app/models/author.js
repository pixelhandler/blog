import Resource from 'pixelhandler-blog/models/base';
import { attr, hasMany } from 'pixelhandler-blog/models/base';

export default Resource.extend({
  type: 'authors',

  name: attr(),
  email: attr(),

  posts: hasMany('posts')
});
