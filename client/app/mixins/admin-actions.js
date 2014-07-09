import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    save: function () {
      // TODO FIXUP use ember-orbit / JSONAPISource
      //this.modelFor(this.get('routeName')).save().then(function() {
        //this.transitionTo('admin');
      //}.bind(this));
      var model = this.modelFor(this.get('routeName'));
      Ember.$.ajax({
        url: PixelhandlerBlogENV.API_HOST + '/posts/' + model.id, 
        type: "PUT",
        data: model.toJSON()
      }).then(function() {
        this.transitionTo('admin');
      }.bind(this));
    },

    cancel: function () {
      // TODO FIXUP rollback, how to do with ember-orbit ?
      // this.modelFor(this.get('routeName')).rollback();
      this.transitionTo('admin.index');
    }
  }
});
