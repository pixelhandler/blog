import AuthorAdapter from 'pixelhandler-blog/adapters/author';
import ServiceCache from 'ember-jsonapi-resources/mixins/service-cache';

AuthorAdapter.reopenClass({
  isServiceFactory: true
});

export default AuthorAdapter.extend(ServiceCache);
