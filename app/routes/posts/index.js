import Ember from 'ember';
import RecordChunksMixin from 'pixelhandler-blog/mixins/record-chunks';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

export default Ember.Route.extend(
    ResetScroll, RecordChunksMixin, RenderUsingTimings, {

  serviceName: 'posts',

  limit: 20,
  offset: -20,

  measurementName: 'archive_view'
});
