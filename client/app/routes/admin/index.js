import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  model: function () {
    // TODO FIX Orbit initializer, 
    // return this.store.find('post');
    return Ember.$.get(PixelhandlerBlogENV.API_HOST + '/posts');
  },
  actions: {
    destroy: function (model) {
      model.destroyRecord();//.then(function () { model.unloadRecord(); });
    }
  }
});
