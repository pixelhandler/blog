import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import { appReady, appUnload } from './utils/metrics';

Ember.MODEL_FACTORY_INJECTIONS = true;

window.showdown = new Showdown.converter();

const App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
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
