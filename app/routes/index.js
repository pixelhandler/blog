import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';
import RenderUsingTimings from '../mixins/render-using-timings';

export default Ember.Route.extend(
    ResetScroll, RecordChunksMixin, RenderUsingTimings, {

  resourceName: 'post',

  limit: 5,
  offset: -5,

  beforeModel: function () {
    var posts = this.modelFor('application');
    var postsCount = posts.get('length');
    var limit = this.get('limit');
    if (this.get('offset') < (postsCount - limit)) {
      this.set('offset', (postsCount - limit));
    } else {
      this.set('offset', this.get('offset') + limit);
    }
  },

  model: function () {
    var posts = this.modelFor('application');
    if (this.get('offset') < posts.get('length')) {
      return posts;
    } else {
      var query = this.buildQuery();
      return this.store.find('post', query);
    }
  },

  measurementName: 'index_view',

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }
});
