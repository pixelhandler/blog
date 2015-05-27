import AuthorsService from 'pixelhandler-blog/services/authors';
import AuthorModel from 'pixelhandler-blog/models/author';
import AuthorAdapter from 'pixelhandler-blog/adapters/author';
import AuthorSerializer from 'pixelhandler-blog/serializers/author';

export function initialize(container, application) {
  const adapter = 'service:authors-adapter';
  const serializer = 'service:authors-serializer';
  const service = 'service:authors';
  const model = 'model:authors';

  application.register(model, AuthorModel, { instantiate: false });
  application.register(service, AuthorsService);
  application.register(adapter, AuthorAdapter);
  application.register(serializer, AuthorSerializer);

  application.inject('route', 'authors', service);
  application.inject(model, 'service', service);
  application.inject(service, 'serializer', serializer);
}

export default {
  name: 'authors-service',
  initialize: initialize
};
