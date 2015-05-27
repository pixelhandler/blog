import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

export default Ember.Route.extend(ResetScroll, RenderUsingTimings, {
  measurementName: 'post_view',

  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('post.comments').set('model', model.get('comments'));
  },

  renderTemplate(controller, model) {
    this.measureRenderTime();
    this._super(controller, model);

    this.render('post.comments', {
      into: 'post.detail',
      outlet: 'comments',
      controller: this.controllerFor('post.comments')
    });
  }
});
