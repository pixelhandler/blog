export function initialize() {
  // see http://emberjs.com/deprecations/v2.x/#toc_initializer-arity
  let application = arguments[1] || arguments[0];

  application.inject('route', 'comments', 'service:comments');
  application.inject('service:store', 'comments', 'service:comments');
  application.inject('service:comments', 'serializer', 'serializer:comment');
}

export default {
  name: 'comments-service',
  after: 'store',
  initialize: initialize
};
