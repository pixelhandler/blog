'use-strict';

var isLocal = (window.location.hostname === 'localhost');

function confirmDialog() {
  if (isLocal) {
    return true;
  } else {
    var msg = 'Are you sure you want to delete (there is no undo)?';
    return window.confirm(msg);
  }
}

module.exports = App.AdminIndexController = Ember.ArrayController.extend({
  actions: {
    destroy: function (model) {
      return confirmDialog();
    }
  }
});
