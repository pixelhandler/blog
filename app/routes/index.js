import Ember from 'ember';
import RecordChunksMixin from 'pixelhandler-blog/mixins/record-chunks';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

export default Ember.Route.extend(
    ResetScroll, RecordChunksMixin, RenderUsingTimings, {

  resourceName: 'posts',

  limit: 5,
  offset: -5,

  beforeModel() {
    var posts = this.modelFor('application');
    var postsCount = posts.get('length');
    var limit = this.get('limit');
    if (this.get('offset') < (postsCount - limit)) {
      this.set('offset', (postsCount - limit));
    } else {
      this.set('offset', this.get('offset') + limit);
    }
  },

  model() {
    var posts = this.modelFor('application');
    if (this.get('offset') < posts.get('length')) {
      return posts;
    } else {
      const query = this.buildQuery();
      return this[this.get('resourceName')].find(query);
    }
  },

  measurementName: 'index_view',

  actions: {
    showMore() {
      this.preventScroll = true;
      this.refresh();
    }
  }
});
