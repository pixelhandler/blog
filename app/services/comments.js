import CommentAdapter from '../adapters/comment';
import ServiceCache from '../mixins/service-cache';

CommentAdapter.reopenClass({
  isServiceFactory: true
});

export default CommentAdapter.extend(ServiceCache);
