import { moduleFor, test } from 'ember-qunit';
import Model from '../../../models/comment';

moduleFor('model:comment', 'Unit | Model | comment', {
  // Specify the other units that are required for this test.
  needs: [],
  beforeEach() {
    const opts = { instantiate: false, singleton: false };
    Model.prototype.container = this.container;
    // Use a non-standard name, i.e. pluralized instead of singular
    this.registry.register('model:comments', Model, opts);
  },
  afterEach() {
    delete Model.prototype.container;
    this.registry.unregister('model:comments');
  }
});

test('comments has "type" property set to: comments', function(assert) {
  var model = this.container.lookupFactory('model:comments').create();
  assert.equal(model.get('type'), 'comments', 'resource has expected type');
});
