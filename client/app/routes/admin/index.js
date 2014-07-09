import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  model: function () {
    return this.store.find('post');
  },
  actions: {
    destroy: function (model) {
      model.destroyRecord();//.then(function () { model.unloadRecord(); });
    }
  }
});
