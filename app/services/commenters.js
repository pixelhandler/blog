import CommenterAdapter from '../adapters/commenter';
import ServiceCache from '../mixins/service-cache';

CommenterAdapter.reopenClass({
  isServiceFactory: true
});

export default CommenterAdapter.extend(ServiceCache);
