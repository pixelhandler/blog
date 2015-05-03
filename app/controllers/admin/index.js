import Ember from 'ember';

var isLocal = (window.location.hostname === 'localhost');

function confirmDialog() {
  if (isLocal) { return true; }
  var msg = 'Are you sure you want to delete (there is no undo)?';
  return window.confirm(msg);
}

export default Ember.Controller.extend({
  actions: {
    destroy: function () {
      return confirmDialog();
    }
  }
});
