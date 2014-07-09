import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import AdminActions from '../../mixins/admin-actions';

export default Ember.Route.extend(ResetScroll, AdminActions, {
  model: function (params) {
    return this.store.find('post', params.edit_id);
  }
});
