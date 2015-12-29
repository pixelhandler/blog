import { moduleFor, test } from 'ember-qunit';
import Model from '../../../models/tag';

moduleFor('model:tag', 'Unit | Model | tag', {
  // Specify the other units that are required for this test.
  needs: [],
  beforeEach() {
    const opts = { instantiate: false, singleton: false };
    Model.prototype.container = this.container;
    // Use a non-standard name, i.e. pluralized instead of singular
    this.registry.register('model:tags', Model, opts);
  },
  afterEach() {
    delete Model.prototype.container;
    this.registry.unregister('model:tags');
  }
});

test('tags has "type" property set to: tags', function(assert) {
  var model = this.container.lookupFactory('model:tags').create();
  assert.equal(model.get('type'), 'tags', 'resource has expected type');
});
