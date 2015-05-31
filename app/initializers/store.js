import StoreService from 'pixelhandler-blog/services/store';

export function initialize(container, application) {
  const store = 'service:store';
  application.register(store, StoreService);
  application.inject('route', 'store', store);
  application.inject('controller', 'store', store);
}

export default {
  name: 'store',
  initialize: initialize
};
