import Ember from 'ember';
import config from '../config/environment';
import { pageView } from '../utils/metrics';

if (config.APP.GOOGLE_ANALYTICS) {
  /*jshint -W030 */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', config.APP.GOOGLE_ANALYTICS, 'pixelhandler.com');
  ga('send', 'pageview');
}

export default Ember.Mixin.create({
  pageHasGa: function() {
    return config.APP.GOOGLE_ANALYTICS && window.ga && typeof window.ga === "function";
  },

  trackPageView: function(page) {
    if (this.pageHasGa()) {
      if (!page) {
        var loc = window.location;
        page = loc.hash ? loc.hash.substring(1) : loc.pathname + loc.search;
      }

      ga('send', 'pageview', page);
    }
    if (config.APP.REPORT_METRICS) {
      pageView();
    }
  },

  trackEvent: function(category, action, label, value) {
    if (this.pageHasGa()) {
      ga('send', 'event', category, action, label, value);
    }
  }
});
