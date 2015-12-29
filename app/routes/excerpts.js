import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

const { Route, isEmpty, computed, run } = Ember;

export default Route.extend(ResetScroll, RecordChunksMixin, {

  serviceName: 'posts',

  limit: 5,
  offset: -5,

  beforeModel() {
    if (!this.refreshing && this.get('offset') > 0) {
      return;
    }
    let posts = this.modelFor('application');
    let postsCount = posts.get('length');
    let limit = this.get('limit');
    let offset = this.get('offset');
    if (offset < (postsCount - limit)) {
      if (window.location.search.match('search') !== null) {
        offset = offset + postsCount - limit;
      } else {
        offset = postsCount - limit;
      }
      this.set('offset', offset);
    } else {
      this.set('offset', offset + limit);
    }
  },

  buildQuery() {
    let query = this._super();
    query.include = 'tags';
    let filter = this.controllerFor('application').get('searchFilter');
    filter = filter || this.get('searchFilter');
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
    let isNotResetting = !this.resettingFilter
    if (isNotResetting && noFilter && (this.get('offset') < posts.get('length'))) {
      return posts;
    } else {
      return this.store.find('posts', { query: query });
    }
  },

  afterModel(model, transition) {
    this.resetting = false;
    return this._super(model, transition);
  },

  activate() {
    this.controllerFor('application').set('isSearchEnabled', true);
  },

  deactivate() {
    this.controllerFor('excerpts').set('searchFilter', '');
    this.controllerFor('application').set('isSearchEnabled', false);
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
      run.throttle(this, this._doSearch, 500);
    }
  },

  _doSearch() {
    this.set('offset', -5);
    this.set('loadedIds.content', Ember.A([]));
    this.refresh();
  }
});

