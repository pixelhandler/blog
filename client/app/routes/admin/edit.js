import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import AdminActions from '../../mixins/admin-actions';

export default Ember.Route.extend(ResetScroll, AdminActions, {
  model: function (params) {
    return this.store.find('post', params.edit_id);
    /* or with plain ajax...
    var _this = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var uri = PixelhandlerBlogENV.API_HOST + '/posts/' + params.post_id;
      Ember.$.get(uri).then(function (payload) {
        _this.set('meta', payload.meta);
        resolve(payload.posts);
      }, function(error) {
        reject(error);
      });
    });
    */
  }
});
