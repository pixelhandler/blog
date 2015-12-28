import { moduleFor, test } from 'ember-qunit';
import Resource from '../../../models/post';

moduleFor('serializer:post', 'Unit | Serializer | post', {
  beforeEach() {
    Resource.prototype.container = this.container;
    let opts = { instantiate: false, singleton: false };
    this.registry.register('model:posts', Resource, opts);
  },
  afterEach() {
    delete Resource.prototype.container;
  }
});

// Replace this with your real tests.
test('it serializes resources', function(assert) {
  let resource = this.container.lookupFactory('model:posts').create();
  let serializer = this.subject();
  var serializedResource = serializer.serialize(resource);
  assert.equal(serializedResource.data.type, 'posts', 'serializes a post resource');
});
