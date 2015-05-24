import Ember from 'ember';

const isLocal = (window.location.hostname === 'localhost');

function confirmDialog() {
  if (isLocal) { return true; }
  const msg = 'Are you sure you want to delete (there is no undo)?';
  return window.confirm(msg);
}

export default Ember.Controller.extend({
  actions: {
    destroy() {
      return confirmDialog();
    }
  }
});
