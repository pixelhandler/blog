import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import AdminActions from '../../mixins/admin-actions';
import Post from '../../models/post';

export default Ember.Route.extend(ResetScroll, AdminActions, {
  resourceName: 'post',

  model: function () {
    return Post.newRecord();
  },

  afterModel: function (model) {
    return this.store.find('author').then(function (authors) {
      var id = authors.get('firstObject').get('id');
      model.set('author_id', id);
    });
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('dateInput', moment().format('L'));
  }

});
