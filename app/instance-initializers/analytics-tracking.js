export function initialize(application) {
  const router = application.container.lookup('router:main');
  router.on('didTransition', function() {
    this.trackPageView(this.get('url'));
  });
}

export default {
  name: 'analytics-tracking',
  initialize: initialize
};
