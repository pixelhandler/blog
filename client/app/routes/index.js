import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, {

  resourceName: 'post',

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }

});
