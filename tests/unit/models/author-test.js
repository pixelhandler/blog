import { moduleFor, test } from 'ember-qunit';
import Model from '../../../models/author';

moduleFor('model:author', 'Unit | Model | author', {
  // Specify the other units that are required for this test.
  needs: [],
  beforeEach() {
    const opts = { instantiate: false, singleton: false };
    Model.prototype.container = this.container;
    // Use a non-standard name, i.e. pluralized instead of singular
    this.registry.register('model:authors', Model, opts);
  },
  afterEach() {
    delete Model.prototype.container;
    this.registry.unregister('model:authors');
  }
});

test('authors has "type" property set to: authors', function(assert) {
  var model = this.container.lookupFactory('model:authors').create();
  assert.equal(model.get('type'), 'authors', 'resource has expected type');
});
