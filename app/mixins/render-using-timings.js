import Ember from 'ember';
import config from 'pixelhandler-blog/config/environment';
import { mark, measure, report } from 'pixelhandler-blog/utils/metrics';

export default Ember.Mixin.create({

  measurementName: Ember.required,

  reportUserTimings: true,

  renderTemplate(controller, model) {
    const beginName = 'mark_begin_rendering_' + this.measurementName;
    const endName = 'mark_end_rendering_' + this.measurementName;
    if (config.APP.REPORT_METRICS) {
      mark(beginName);
      Ember.run.scheduleOnce('afterRender', this, function() {
        mark(endName);
        measure(this.measurementName, beginName, endName);
        if (this.reportUserTimings) {
          report();
        }
      });
    }
    return this._super(controller, model);
  }

});
