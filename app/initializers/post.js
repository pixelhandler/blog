export function initialize() {
  // see http://emberjs.com/deprecations/v2.x/#toc_initializer-arity
  let application = arguments[1] || arguments[0];

  application.inject('route', 'posts', 'service:posts');
  application.inject('service:store', 'posts', 'service:posts');
  application.inject('service:posts', 'serializer', 'serializer:post');
}

export default {
  name: 'posts-service',
  after: 'store',
  initialize: initialize
};
