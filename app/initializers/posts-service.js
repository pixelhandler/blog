import PostsService from '../services/posts';
import PostModel from '../models/post';
import PostAdapter from '../adapters/post';
import PostSerializer from '../serializers/post';

export function initialize(container, application) {
  const adapter = 'service:posts-adapter';
  const serializer = 'service:posts-serializer';
  const service = 'service:posts';
  const model = 'model:posts';

  application.register(model, PostModel, { instantiate: false, singleton: false });
  application.register(service, PostsService);
  application.register(adapter, PostAdapter);
  application.register(serializer, PostSerializer);

  application.inject('route', 'posts', service);
  application.inject('service:store', 'posts', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'posts-service',
  after: 'store',
  initialize: initialize
};
