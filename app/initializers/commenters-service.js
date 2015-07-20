import CommentersService from '../services/commenters';
import CommenterModel from '../models/commenter';
import CommenterAdapter from '../adapters/commenter';
import CommenterSerializer from '../serializers/commenter';

export function initialize(container, application) {
  const adapter = 'service:commenters-adapter';
  const serializer = 'service:commenters-serializer';
  const service = 'service:commenters';
  const model = 'model:commenters';

  application.register(model, CommenterModel, { instantiate: false, singleton: false });
  application.register(service, CommentersService);
  application.register(adapter, CommenterAdapter);
  application.register(serializer, CommenterSerializer);

  application.inject('route', 'commenters', service);
  application.inject('service:store', 'commenters', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'commenters-service',
  after: 'store',
  initialize: initialize
};
