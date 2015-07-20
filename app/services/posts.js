import PostAdapter from '../adapters/post';
import ServiceCache from '../mixins/service-cache';

PostAdapter.reopenClass({
  isServiceFactory: true
});

export default PostAdapter.extend(ServiceCache);
