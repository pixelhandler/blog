import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    save: function () {
      var model = this.modelFor(this.get('routeName'));
      var type = model.resourceName;
      this.store.then(function () {
        this.transitionTo('admin.index');
      }.bind(this));
      this.store.add(type, model.toJSON());
    },

    cancel: function () {
      this.transitionTo('admin.index');
    },

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
