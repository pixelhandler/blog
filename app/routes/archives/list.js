import Ember from 'ember';
import RecordChunksMixin from '../../mixins/record-chunks';
import ResetScroll from '../../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, {

  serviceName: 'posts',

  limit: 20,
  offset: -20
});
