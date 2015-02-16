import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';
import RecordChunksMixin from '../mixins/record-chunks';
import RenderUsingTimings from '../mixins/render-using-timings';
import { mark, measure } from '../utils/metrics';
import config from '../config/environment';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, RenderUsingTimings, {
  resourceName: 'metric',

  limit: 10000,
  offset: -10000,
  sortBy: 'date',
  order: 'desc',

  measurementName: 'metrics_view',

  model: function () {
    if (config.APP.REPORT_METRICS) {
      mark('mark_begin_find_metric_records');
    }
    return this._super();
  },

  afterModel(collection) {
    if (config.APP.REPORT_METRICS) {
      mark('mark_end_find_metric_records');
      measure('find_posts', 'mark_begin_find_metric_records', 'mark_end_find_metric_records');
    }
    return this._super(collection);
  },

  activate: function() {
    this.controllerFor('application').set('isTwoColumns', false);
  },

  deactivate: function() {
    this.controllerFor('application').set('isTwoColumns', true);
  },

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }
});
