import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from 'pixelhandler-blog/config/environment';
import { appReady, appUnload } from 'pixelhandler-blog/utils/metrics';

Ember.MODEL_FACTORY_INJECTIONS = true;

window.showdownConverter = new showdown.Converter();

const App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,

  ready: function() {
    if (config.APP.REPORT_METRICS) {
      appReady();
      Ember.$(window).on('unload', appUnload);
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
