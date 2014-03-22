'use-strict';

module.exports = App.NotFoundRoute = Ember.Route.extend({

  redirect: function () {
    var url = this.router.location.formatURL('/not-found');
    if (window.location.pathname !== url) {
      this.transitionTo('/not-found');// [loc.protocol, '//', loc.host, url].join('');
    }
  }

});
