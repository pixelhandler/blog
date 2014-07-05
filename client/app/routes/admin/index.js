import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  model: function () {
    // TODO FIX Orbit initializer, 
    // return this.store.find('post');
    // then pitch below...
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var uri = PixelhandlerBlogENV.API_HOST + '/posts';
      Ember.$.get(uri).then(function (payload) {
        resolve(payload.posts);
      }, function(error) {
        reject(error);
      });
    });
  },
  actions: {
    destroy: function (model) {
      model.destroyRecord();//.then(function () { model.unloadRecord(); });
    }
  }
});
