import Ember from 'ember';
import RecordChunksMixin from 'pixelhandler-blog/mixins/record-chunks';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

export default Ember.Route.extend(
    ResetScroll, RecordChunksMixin, RenderUsingTimings, {

  serviceName: 'posts',

  limit: 5,
  offset: -5,

  beforeModel() {
    if (!this.refreshing && this.get('offset') > 0) {
      return;
    }
    const posts = this.modelFor('application');
    const postsCount = posts.get('length');
    const limit = this.get('limit');
    if (this.get('offset') < (postsCount - limit)) {
      this.set('offset', (postsCount - limit));
    } else {
      this.set('offset', this.get('offset') + limit);
    }
  },

  model() {
    const posts = this.modelFor('application');
    if (this.get('offset') < posts.get('length')) {
      return posts;
    } else {
      const query = { query: this.buildQuery() };
      return this[this.get('serviceName')].find(query);
    }
  },

  measurementName: 'index_view',

  actions: {
    showMore() {
      this.preventScroll = true;
      this.refreshing = true;
      this.refresh();
    }
  }
});
