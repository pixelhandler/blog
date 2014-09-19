import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, {

  resourceName: 'post',

  limit: 5,
  offset: 0,
  sortBy: 'date',
  order: 'desc',

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

  //setupController: function (controller, collection) {
    //controller.incrementProperty('page');
    //return this._super(controller, collection);
  //},

  //resetController: function (controller, isExiting) {
    //if (isExiting) {
      //controller.set('page', 0);
    //}
  //},

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }
});
