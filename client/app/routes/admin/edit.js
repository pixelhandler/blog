import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import AdminActions from '../../mixins/admin-actions';

export default Ember.Route.extend(ResetScroll, AdminActions, {
  model: function (params) {
    // TODO FIX Orbit initializer, 
    // return this.store.find('post', params.edit_id);
    return Ember.$.get(PixelhandlerBlogENV.API_HOST + '/posts/' + params.post_id);
  }
});
