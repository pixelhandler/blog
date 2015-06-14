import CommenterAdapter from 'pixelhandler-blog/adapters/commenter';
import ServiceCache from 'ember-jsonapi-resources/mixins/service-cache';

CommenterAdapter.reopenClass({
  isServiceFactory: true
});

export default CommenterAdapter.extend(ServiceCache);
