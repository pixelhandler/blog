import CommentsService from '../services/comments';
import CommentModel from '../models/comment';
import CommentAdapter from '../adapters/comment';
import CommentSerializer from '../serializers/comment';

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
  application.inject('service:store', 'comments', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'comments-service',
  after: 'store',
  initialize: initialize
};
