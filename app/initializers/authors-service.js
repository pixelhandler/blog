import AuthorsService from '../services/authors';
import AuthorModel from '../models/author';
import AuthorAdapter from '../adapters/author';
import AuthorSerializer from '../serializers/author';

export function initialize(container, application) {
  const adapter = 'service:authors-adapter';
  const serializer = 'service:authors-serializer';
  const service = 'service:authors';
  const model = 'model:authors';

  application.register(model, AuthorModel, { instantiate: false, singleton: false });
  application.register(service, AuthorsService);
  application.register(adapter, AuthorAdapter);
  application.register(serializer, AuthorSerializer);

  application.inject('route', 'authors', service);
  application.inject('service:store', 'authors', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'authors-service',
  after: 'store',
  initialize: initialize
};
