import Ember from 'ember';
import RecordChunksMixin from '../../../mixins/record-chunks';
import { module, test } from 'qunit';

module('Unit | Mixin | record chunks');

// Replace this with your real tests.
test('it works', function(assert) {
  let RecordChunksObject = Ember.Object.extend(RecordChunksMixin);
  let subject = RecordChunksObject.create();
  assert.ok(subject);
});
