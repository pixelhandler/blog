import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Controller.extend({
  username: null,
  email: null,
  error: null,
  commenterUrl: config.APP.API_HOST + '/' + config.APP.API_COMMENTER,
  isCommenterAuthorized: false,
  commentorId: null,
  commentText: null,

  actions: {
    submitComment() {
      return this.get('target').send('submitComment', this.newResource());
    },

    authorize() {
      const commenter = JSON.stringify({
        username: this.get('username'),
        email: this.get('email')
      });
      Ember.$.ajax({
        url: this.get('commenterUrl'),
        type: 'POST',
        data: commenter,
        dataType: 'text',
        contentType: 'application/json'
      })
        .done(authorizeSuccess.bind(this))
        .fail(authorizeFailure.bind(this));
      return false;
    },

    deauthorize() {
      this.setProperties({
        'username': null,
        'email': null,
        'error': null,
        'isCommenterAuthorized': false,
        'commenterId': null
      });
      window.localStorage.removeItem('AuthorizationHeader');
      window.localStorage.removeItem('CommenterId');
    }
  },

  newResource() {
    const resource = this.container.lookupFactory('model:comment').create({
      attributes: {
        body: this.get('commentText')
      }
    });
    resource.addRelationship('commenter', this.get('commenterId'));
    resource.addRelationship('post', this.get('postId'));

    return resource;
  }
});

function authorizeSuccess(data) {
  Ember.Logger.info('autorize success', data);
  Ember.run(function () {
    let response = JSON.parse(data);
    window.localStorage.setItem('AuthorizationHeader', response.auth_token);
    window.localStorage.setItem('CommenterId', response.commenter_id);
    this.setProperties({
      'isCommenterAuthorized': true,
      'email': null,
      'error': null,
      'commenterId': response.commenter_id
    });
  }.bind(this));
}

function authorizeFailure(xhr, status, error) {
  Ember.Logger.warn('authorize failure', xhr, status, error);
  xhr = xhr || void 0;
  status = status || void 0;
  Ember.run(function () {
    this.setProperties({ 'error': error, 'email': null, 'commenterId': null });
  }.bind(this));
}
