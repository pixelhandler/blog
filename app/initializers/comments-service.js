import CommentsService from 'pixelhandler-blog/services/comments';
import CommentModel from 'pixelhandler-blog/models/comment';
import CommentAdapter from 'pixelhandler-blog/adapters/comment';
import CommentSerializer from 'pixelhandler-blog/serializers/comment';

export function initialize(container, application) {
  const adapter = 'service:comments-adapter';
  const serializer = 'service:comments-serializer';
  const service = 'service:comments';
  const model = 'model:comments';

  application.register(model, CommentModel, { instantiate: false, singleton: false });
  application.register(service, CommentsService);
  application.register(adapter, CommentAdapter);
  application.register(serializer, CommentSerializer);

  application.inject('route', 'comments', service);
  application.inject(model, 'service', service);
  application.inject('service:store', 'comments', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'comments-service',
  after: 'store',
  initialize: initialize
};
