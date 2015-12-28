import { moduleFor, test } from 'ember-qunit';
import Model from '../../../models/commenter';

moduleFor('model:commenter', 'Unit | Model | commenter', {
  // Specify the other units that are required for this test.
  needs: [],
  beforeEach() {
    const opts = { instantiate: false, singleton: false };
    Model.prototype.container = this.container;
    // Use a non-standard name, i.e. pluralized instead of singular
    this.registry.register('model:commenters', Model, opts);
  },
  afterEach() {
    delete Model.prototype.container;
    this.registry.unregister('model:commenters');
  }
});

test('commenters has "type" property set to: commenters', function(assert) {
  var model = this.container.lookupFactory('model:commenters').create();
  assert.equal(model.get('type'), 'commenters', 'resource has expected type');
});
