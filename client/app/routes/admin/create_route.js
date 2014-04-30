'use-strict';

module.exports = App.AdminCreateRoute = Ember.Route.extend({
  model: function (params) {
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
      var model = this.modelFor(this.get('routeName'));
      this.dataSource.add('post', model).then(function (model) {
        this.transitionTo('admin');
      }.bind(this));
    },

    cancel: function () {
      //this.modelFor(this.get('routeName')).deleteRecord();
      // TODO remove record
      this.transitionTo('admin.index');
    }
  }
});
