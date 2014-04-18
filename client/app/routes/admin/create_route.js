'use-strict';

module.exports = App.AdminCreateRoute = Ember.Route.extend({
  model: function (params) {
    //var post = this.store.createRecord('post');
    //post.set('author', { name: 'pixelhandler' });
    //return post;
    return {
      slug: '',
      title: '',
      author: { name: 'pixelhandler' },
      date: new Date(),
      excerpt: '',
      body: ''
    };
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('dateInput', moment().format('L'));
  },

  actions: {
    save: function () {
      //this.modelFor(this.get('routeName')).save().then(function (model) {
      //  this.transitionTo('admin');
      //}.bind(this));
      // TODO add to store
    },

    cancel: function () {
      //this.modelFor(this.get('routeName')).deleteRecord();
      // TODO remove record
      this.transitionTo('admin.index');
    }
  }
});
