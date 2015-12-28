import { moduleFor, test } from 'ember-qunit';
import Resource from '../../../models/commenter';

moduleFor('serializer:commenter', 'Unit | Serializer | commenter', {
  beforeEach() {
    Resource.prototype.container = this.container;
    let opts = { instantiate: false, singleton: false };
    this.registry.register('model:commenters', Resource, opts);
  },
  afterEach() {
    delete Resource.prototype.container;
  }
});

// Replace this with your real tests.
test('it serializes resources', function(assert) {
  let resource = this.container.lookupFactory('model:commenters').create();
  let serializer = this.subject();
  var serializedResource = serializer.serialize(resource);
  assert.equal(serializedResource.data.type, 'commenters', 'serializes a commenter resource');
});
