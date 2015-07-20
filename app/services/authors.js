import AuthorAdapter from '../adapters/author';
import ServiceCache from '../mixins/service-cache';

AuthorAdapter.reopenClass({
  isServiceFactory: true
});

export default AuthorAdapter.extend(ServiceCache);
