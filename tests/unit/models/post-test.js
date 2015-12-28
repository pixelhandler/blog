import { moduleFor, test } from 'ember-qunit';
import Model from '../../../models/post';

moduleFor('model:post', 'Unit | Model | post', {
  // Specify the other units that are required for this test.
  needs: [],
  beforeEach() {
    const opts = { instantiate: false, singleton: false };
    Model.prototype.container = this.container;
    // Use a non-standard name, i.e. pluralized instead of singular
    this.registry.register('model:posts', Model, opts);
  },
  afterEach() {
    delete Model.prototype.container;
    this.registry.unregister('model:posts');
  }
});

test('posts has "type" property set to: posts', function(assert) {
  var model = this.container.lookupFactory('model:posts').create();
  assert.equal(model.get('type'), 'posts', 'resource has expected type');
});
