import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, {

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

  buildQuery() {
    let query = this._super();
    query.include = 'tags';
    return query;
  },

  model() {
    const posts = this.modelFor('application');
    if (this.get('offset') < posts.get('length')) {
      return posts;
    } else {
      const query = { query: this.buildQuery() };
      return this.store.find('posts', query);
    }
  },

  actions: {
    showMore() {
      this.preventScroll = true;
      this.refreshing = true;
      this.refresh();
    }
  }
});

