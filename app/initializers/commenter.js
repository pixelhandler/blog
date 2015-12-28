export function initialize() {
  // see http://emberjs.com/deprecations/v2.x/#toc_initializer-arity
  let application = arguments[1] || arguments[0];

  application.inject('route', 'commenters', 'service:commenters');
  application.inject('service:store', 'commenters', 'service:commenters');
  application.inject('service:commenters', 'serializer', 'serializer:commenter');
}

export default {
  name: 'commenters-service',
  after: 'store',
  initialize: initialize
};
