import CommentersService from 'pixelhandler-blog/services/commenters';
import CommenterModel from 'pixelhandler-blog/models/commenter';
import CommenterAdapter from 'pixelhandler-blog/adapters/commenter';
import CommenterSerializer from 'pixelhandler-blog/serializers/commenter';

export function initialize(container, application) {
  const adapter = 'service:commenters-adapter';
  const serializer = 'service:commenters-serializer';
  const service = 'service:commenters';
  const model = 'model:commenters';

  application.register(model, CommenterModel, { instantiate: false });
  application.register(service, CommentersService);
  application.register(adapter, CommenterAdapter);
  application.register(serializer, CommenterSerializer);

  application.inject('route', 'commenters', service);
  application.inject(model, 'service', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'commenters-service',
  initialize: initialize
};
