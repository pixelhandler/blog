import Resource from 'pixelhandler-blog/models/base';
import { attr, hasMany } from 'pixelhandler-blog/models/base';

export default Resource.extend({
  type: 'commenters',

  name: attr(),
  email: attr(),
  hash: attr(),

  comments: hasMany('comments')
});
