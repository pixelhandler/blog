export function initialize() {
  // see http://emberjs.com/deprecations/v2.x/#toc_initializer-arity
  let application = arguments[1] || arguments[0];

  application.inject('route', 'tags', 'service:tags');
  application.inject('service:store', 'tags', 'service:tags');
  application.inject('service:tags', 'serializer', 'serializer:tag');
}

export default {
  name: 'tags-service',
  after: 'store',
  initialize: initialize
};
