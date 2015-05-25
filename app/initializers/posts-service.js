import PostsService from 'pixelhandler-blog/services/posts';
import PostModel from 'pixelhandler-blog/models/post';
import PostAdapter from 'pixelhandler-blog/adapters/post';
import PostSerializer from 'pixelhandler-blog/serializers/post';

export function initialize(container, application) {
  const adapter = 'service:posts-adapter';
  const serializer = 'service:posts-serializer';
  const service = 'service:posts';
  const model = 'model:posts';

  application.register(model, PostModel, { instantiate: false });
  application.register(service, PostsService);
  application.register(adapter, PostAdapter);
  application.register(serializer, PostSerializer);

  application.inject('route', 'posts', service);
  application.inject(model, 'service', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'posts-service',
  initialize: initialize
};
