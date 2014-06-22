import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  model: function (params) {
    return this.store.find('post', params.edit_id);
  },

  actions: {
    save: function () {
      this.modelFor(this.get('routeName')).save().then(function() {
        this.transitionTo('admin');
      }.bind(this));
    },

    cancel: function () {
      this.modelFor(this.get('routeName')).rollback();
      this.transitionTo('admin.index');
    }
  }
});
