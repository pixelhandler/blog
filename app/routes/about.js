import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

export default Ember.Route.extend(ResetScroll, RenderUsingTimings, {
  measurementName: 'about_view'
});
