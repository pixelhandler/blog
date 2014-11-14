import Ember from 'ember';
import RecordChunksMixin from '../../mixins/record-chunks';
import ResetScroll from '../../mixins/reset-scroll';
import PushSupport from '../../mixins/push-support';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, PushSupport, {
  resourceName: 'post',

  limit: 20,
  offset: -20,
  sortBy: 'date',
  order: 'desc',

  // Push support...

  onDidPatch: function () {
    this.socket.on('didPatch', this.patchRecord.bind(this));
  }.on('init'),

  addRecord: function (operation) {
    if (operation.path.split('/')[1] === 'posts') {
      this._addRecord(operation);
    }
  },

  updateAttribute: function (operation) {
    if (operation.path.split('/')[1] === 'posts') {
      this._updateAttribute(operation);
    }
  },

  deleteRecord: function (operation) {
    if (operation.path.split('/')[1] === 'posts') {
      this._deleteRecord(operation);
    }
  },

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }
});
