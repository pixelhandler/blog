import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

var PostRoute = Ember.Route.extend(ResetScroll, RenderUsingTimings, {
  measurementName: 'post_view',

  afterModel(post) {
    return post.get('comments').reload().then(function(res) {
      console.log(post.get('comments.length'), res);
    });
  }
});

export default PostRoute;
