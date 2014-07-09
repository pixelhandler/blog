import Ember from 'ember';
import ResetScroll from '../../mixins/reset-scroll';
import AdminActions from '../../mixins/admin-actions';

export default Ember.Route.extend(ResetScroll, AdminActions, {
  model: function (/*params*/) {
    // TODO fixup need to use a new EO.Model instance

    // var post = this.store.createRecord('post');
    // post.set('author', { name: 'pixelhandler' });
    // return post;
    return {
      slug: '',
      title: '',
      author: { name: 'pixelhandler' },
      date: null,
      excerpt: '',
      body: ''
    };
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('dateInput', moment().format('L'));
  }
});
