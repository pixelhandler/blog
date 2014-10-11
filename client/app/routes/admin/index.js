import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  resourceName: 'post',

  beforeModel: function () {
    var controller = this.controllerFor('application');
    if (controller.get('isLoggedIn') !== true) {
      this.transitionTo('index');
    }
  },

  model: function () {
    return this.store.find(this.get('resourceName'));
  },

  actions: {
    destroy: function (model) {
      var type = this.get('resourceName');
      // TODO REVEIW, Not thenable ?
      // this.store.remove(type, model.get('id')).then(function () { }.bind(this));
      this.store.remove(type, model.get('id'));
      this.preventScroll = true;
      this.modelFor('application').removeObject(model);
      this.refresh();
    }
  }
});
