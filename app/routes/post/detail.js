import Ember from 'ember';
import ResetScroll from 'pixelhandler-blog/mixins/reset-scroll';
import RenderUsingTimings from 'pixelhandler-blog/mixins/render-using-timings';

export default Ember.Route.extend(ResetScroll, RenderUsingTimings, {
  measurementName: 'post_view',

  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('post.comments').setProperties({
      'model': model.get('comments'),
      'postId': model.get('id')
    });
  },

  renderTemplate(controller, model) {
    this.measureRenderTime();
    this._super(controller, model);

    this.render('post.comments', {
      into: 'post.detail',
      outlet: 'comments',
      controller: this.controllerFor('post.comments')
    });
  },

  actions: {
    submitComment(resource) {
      const controller = this.controllerFor('post.comments');
      return this.comments.createResource(resource).then(function(comment) {
        this.get('model').pushObject(comment);
        this.set('commentText', '');
      }.bind(controller)).catch(function(error) {
        this.set('error', error.toString());
      }.bind(controller));
    }
  }
});
