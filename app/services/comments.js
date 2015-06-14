import CommentAdapter from 'pixelhandler-blog/adapters/comment';
import ServiceCache from 'ember-jsonapi-resources/mixins/service-cache';

CommentAdapter.reopenClass({
  isServiceFactory: true
});

export default CommentAdapter.extend(ServiceCache);
