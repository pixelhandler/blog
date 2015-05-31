import Ember from 'ember';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';
import { mark, measure } from 'pixelhandler-blog/utils/metrics';
import config from 'pixelhandler-blog/config/environment';
import uuid from 'pixelhandler-blog/utils/uuid';

var ApplicationRoute = Ember.Route.extend(RenderUsingTimings, {

  activate() {
    if (!window.localStorage.getItem('visitor')) {
      window.localStorage.setItem('visitor', uuid());
    }
    const token = window.localStorage.getItem('AuthorizationHeader');
    const commenterId = window.localStorage.getItem('CommenterId');
    this.set('isLoggedIn', (!Ember.isEmpty(token) && !commenterId));
  },

  model() {
    if (config.APP.REPORT_METRICS) {
      mark('mark_begin_find_post_records');
    }
    const limit = config.APP.PAGE_LIMIT;
    const options = { 'query': { 'page[limit]': limit, 'sort': '-date' }};
    return this.store.find('posts', options);
  },

  afterModel(model) {
    this.posts.cache.resources = model;
    if (config.APP.REPORT_METRICS) {
      mark('mark_end_find_post_records');
      measure('find_posts', 'mark_begin_find_post_records', 'mark_end_find_post_records');
    }
    return null;
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('isLoggedIn', this.get('isLoggedIn'));
    this.canTransition = false;
  },

  measurementName: 'application_view',
  reportUserTimings: false,

  authUrl: config.APP.API_HOST + '/' + config.APP.API_AUTH,

  actions: {
    login() {
      const controller = this.controllerFor('application');
      this.canTransition = true;
      const credentails = JSON.stringify({
        username: controller.get('username') || Ember.$('input[name="username"]').last().val(),
        password: controller.get('password') || Ember.$('input[name="password"]').last().val()
      });
      Ember.$.ajax({
        url: this.get('authUrl'),
        type: 'POST',
        data: credentails,
        dataType: 'text',
        contentType: 'application/json'
      })
        .done(loginSuccess.bind(this))
        .fail(loginFailure.bind(this));
      return false;
    },

    logout() {
      window.localStorage.removeItem('AuthorizationHeader');
      this.set('isLoggedIn', false);
      this.controllerFor('application').set('isLoggedIn', false);
    },

    error(error, e) {
      console.log(error.stack);
      Ember.Logger.error(error, e);
      this.transitionTo('not-found');
    }
  }

});

export default ApplicationRoute;

function loginSuccess(data) {
  const controller = this.controllerFor('application');
  Ember.run(function () {
    let response = JSON.parse(data);
    window.localStorage.setItem('AuthorizationHeader', response.auth_token);
    controller.setProperties({ 'isLoggedIn': true, 'password': null, 'error': null });
    this.set('isLoggedIn', true);
  }.bind(this));
  if (this.canTransition) {
    this.transitionTo('admin.index');
  }
}

function loginFailure(xhr, status, error) {
  const controller = this.controllerFor('application');
  xhr = xhr || void 0;
  status = status || void 0;
  Ember.run(function () {
    this.setProperties({ 'error': error, 'password': null });
  }.bind(controller));
}
