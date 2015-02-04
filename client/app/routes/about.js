import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';
import RenderUsingTimings from '../mixins/render-using-timings';

export default Ember.Route.extend(ResetScroll, RenderUsingTimings, {
  measurementName: 'about_view'
});
