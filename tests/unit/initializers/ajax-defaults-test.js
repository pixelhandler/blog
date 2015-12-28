import Ember from 'ember';
import AjaxDefaultsInitializer from '../../../initializers/ajax-defaults';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | ajax defaults', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  AjaxDefaultsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
