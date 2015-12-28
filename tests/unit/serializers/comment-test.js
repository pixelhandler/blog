import { moduleFor, test } from 'ember-qunit';
import Resource from '../../../models/comment';

moduleFor('serializer:comment', 'Unit | Serializer | comment', {
  beforeEach() {
    Resource.prototype.container = this.container;
    let opts = { instantiate: false, singleton: false };
    this.registry.register('model:comments', Resource, opts);
  },
  afterEach() {
    delete Resource.prototype.container;
  }
});

// Replace this with your real tests.
test('it serializes resources', function(assert) {
  let resource = this.container.lookupFactory('model:comments').create();
  let serializer = this.subject();
  var serializedResource = serializer.serialize(resource);
  assert.equal(serializedResource.data.type, 'comments', 'serializes a comment resource');
});
