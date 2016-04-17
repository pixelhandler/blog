import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

const { Route, RSVP, isEmpty, computed, run } = Ember;

export default Route.extend(ResetScroll, RecordChunksMixin, {

  serviceName: 'posts',

  limit: 5,
  offset: -5,

  beforeModel() {
    if (!this.refreshing) {
      if (this.get('offset') > 0) {
        return;
      }
      if (isEmpty(this.get('searchFilter'))) {
        this.set('offset', -5);
      }
    }
    this.set('offset', this.get('limit') + this.get('offset'));
  },

  buildQuery() {
    let query = this._super();
    query.include = 'tags';
    let filter = this.get('searchFilter');
    if (!isEmpty(filter)) {
      query['filter[search]'] = filter;
    }
    return query;
  },

  searchFilter: computed(function () {
    if (window.location.search.match('search') === null) {
      return null;
    } else {
      return window.location.search.split('&').filter(function(item) {
        return item.match('search') !== null;
      })[0].substr(1).split('=')[1];
    }
  }).volatile(),

  model() {
    let posts = this.modelFor('application');
    let query = this.buildQuery();
    let searchFilter = query['filter[search]'];
    let noFilter = isEmpty(searchFilter);
    let isNotResetting = !this.resettingFilter;
    let limit = this.get('limit');
    let postsCount = this.get('offset') + limit;
    let appPostsCount = posts.get('length');
    if (isNotResetting && noFilter && (postsCount <= appPostsCount)) {
      this.set('offset', appPostsCount - limit);
      return RSVP.Promise.resolve(posts);
    } else {
      return this.store.find('posts', { query: query });
    }
  },

  afterModel(model, transition) {
    this.resetting = false;
    return this._super(model, transition);
  },

  deactivate() {
    this._resetFilter();
    this._doResetModel();
  },

  actions: {
    showMore() {
      this.preventScroll = true;
      this.refreshing = true;
      this.refresh();
    },

    doSearch(term) {
      if (term === '') {
        this.resettingFilter = true;
      }
      run.throttle(this, this._doSearch, 300);
    },

    home() {
      if (!isEmpty(this.get('searchFilter'))) {
        this.resettingFilter = true;
        this._showRecentPosts();
      }
    }
  },

  // Private …

  _doSearch() {
    this._resetPaging();
    this.refresh();
  },

  _doResetModel() {
    this._resetPaging();
    this._resetFilter();
    this.get('model').call(this).then(function (model) {
      this.controllerFor('excerpts').set('model', model);
      this.notifyPropertyChange('meta');
      this.get('meta.total');
    }.bind(this));
  },

  _showRecentPosts() {
    this._resetPaging();
    this._resetFilter();
    this.refresh();
  },

  _resetPaging() {
    this.set('offset', -5);
    this.set('loadedIds.content', Ember.A([]));
  },

  _resetFilter(term = '') {
    this.controllerFor('application').set('searchFilter', term);
  }

});

