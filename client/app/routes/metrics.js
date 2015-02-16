import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';
import RenderUsingTimings from '../mixins/render-using-timings';
import { mark, measure } from '../utils/metrics';
import config from '../config/environment';

export default Ember.Route.extend(ResetScroll, RenderUsingTimings, {

  measurementName: 'metrics_table',

  limit: 10000,
  offset: 0,
  sortBy: 'date',
  order: 'desc',

  buildQuery: function () {
    return {
      offset: this.get('offset'),
      limit: this.get('limit'),
      sortBy: this.get('sortBy'),
      order: this.get('order')
    };
  },

  model: function () {
    if (config.APP.REPORT_METRICS) {
      mark('mark_begin_find_metric_records');
    }
    var query = this.buildQuery();
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let uri = config.APP.API_HOST;
      uri = (config.APP.API_PATH) ? uri + '/' + config.APP.API_PATH : uri;
      Ember.$.ajax({
        url: uri + '/metrics',
        data: query,
        dataType: 'json',
        type: 'GET',
        traditional: true
      })
      .done(function(json/*, textStatus, jqxhr*/) {
        resolve(json.metrics);
      })
      .fail(function(jqxhr, textStatus, error) {
        reject(error);
      });
    });
  },

  afterModel(collection) {
    if (config.APP.REPORT_METRICS) {
      mark('mark_end_find_metric_records');
      measure('find_metrics', 'mark_begin_find_metric_records', 'mark_end_find_metric_records');
    }
    return this._super(collection);
  },

  activate: function() {
    this.controllerFor('application').set('isTwoColumns', false);
  },

  deactivate: function() {
    this.controllerFor('application').set('isTwoColumns', true);
  }
});
