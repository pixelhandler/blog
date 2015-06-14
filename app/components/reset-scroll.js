import Ember from 'ember';

export default Ember.Component.extend({
  id: null,

  idDidChange: function () {
    Ember.run.scheduleOnce('afterRender', function () {
      window.scroll(0, 0);
    });
  }.observes('id'),
});
