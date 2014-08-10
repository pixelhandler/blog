import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import AdminActions from '../../mixins/admin-actions';

export default Ember.Route.extend(ResetScroll, AdminActions, {
  resourceName: 'post',

  model: function (params) {
    return this.store.find(this.get('resourceName'), params.edit_id);
  }
});
