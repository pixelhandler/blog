import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    save: function () {
      // TODO FIX Orbit initializer, 
      //this.modelFor(this.get('routeName')).save().then(function() {
        //this.transitionTo('admin');
      //}.bind(this));
      var model = this.modelFor(this.get('routeName'));
      debugger;
      Ember.$.ajax({
        url: PixelhandlerBlogENV.API_HOST + '/posts/' + model.id, 
        type: "PUT",
        data: model.toJSON()
      }).then(function() {
        this.transitionTo('admin');
      }.bind(this));
    },

    cancel: function () {
      // TODO rollback
      // this.modelFor(this.get('routeName')).rollback();
      this.transitionTo('admin.index');
    }
  }
});
