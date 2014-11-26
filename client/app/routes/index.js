import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';
import PushSupport from '../mixins/push-support';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, PushSupport, {

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

  // Push support...

  onDidPatch: function () {
    try {
      this.socket.on('didPatch', this.patchRecord.bind(this));
    } catch (e) {
      console.warn('Push support not enabled for index route.');
    }
  }.on('init'),

  addRecord: function (operation) {
    if (operation.path.split('/')[1] === 'posts') {
      var posts = this.model();
      var controller = this.controllerFor(this.get('routeName'));
      if (typeof posts.then === 'function') {
        posts.then(function (_posts) {
          controller.set('model', _posts);
        });
      } else {
        controller.set('model', posts);
      }
    }
  },

  deleteRecord: function (operation) {
    if (operation.path.split('/')[1] === 'posts') {
      this._deleteRecord(operation);
    }
  },

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }
});
