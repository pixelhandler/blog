import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, {

  resourceName: 'post',

  beforeModel: function () {
    // Sanity check, is socket working? check output browser console.
    var socket = this.socket;
    socket.on('hello', function (data) {
      console.log(data);
      socket.emit('talk-to-me', 'I like talking.', function (msg) {
        console.log('back talk', msg);
      });
    });
    this._super();
  },

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }

});
