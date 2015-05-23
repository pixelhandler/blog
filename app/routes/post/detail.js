import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

var PostRoute = Ember.Route.extend(ResetScroll, RenderUsingTimings, {
  measurementName: 'post_view'
});

export default PostRoute;
