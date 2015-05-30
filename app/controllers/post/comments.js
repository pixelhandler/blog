import Ember from 'ember';
import config from 'pixelhandler-blog/config/environment';
import Resource from 'pixelhandler-blog/models/comment';

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
    }
  },

  newResource() {
    const resource = Resource.create({
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
  console.log('autorize success', data);
  Ember.run(function () {
    let response = JSON.parse(data);
    window.localStorage.setItem('AuthorizationHeader', response.auth_token);
    this.setProperties({
      'isCommenterAuthorized': true,
      'email': null,
      'error': null,
      'commenterId': response.commenter_id
    });
  }.bind(this));
}

function authorizeFailure(xhr, status, error) {
  console.log('authorize failure', xhr, status, error);
  xhr = xhr || void 0;
  status = status || void 0;
  Ember.run(function () {
    this.setProperties({ 'error': error, 'email': null, 'commenterId': null });
  }.bind(this));
}
