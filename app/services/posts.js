import PostAdapter from 'pixelhandler-blog/adapters/post';
import ServiceCache from 'ember-jsonapi-resources/mixins/service-cache';

PostAdapter.reopenClass({
  isServiceFactory: true
});

export default PostAdapter.extend(ServiceCache);
