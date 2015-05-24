import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {

  redirect() {
    const url = this.router.location.formatURL('/not-found');
    if (window.location.pathname !== url) {
      this.transitionTo('/not-found');
    }
  }

});
