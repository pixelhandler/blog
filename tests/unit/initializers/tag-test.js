import Ember from 'ember';
import TagInitializer from '../../../initializers/tag';
import { module, test } from 'qunit';

let registry, application, factories, injections;

module('Unit | Initializer | tag', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      registry = application.registry;
      application.deferReadiness();
    });
    application = stub(application);
  },
  afterEach: function() {
    factories = null;
    injections = null;
    application = null;
    registry = null;
  }
});

test('it registers tags factories: model, service, adapter, serializer; injects: service, serializer', function(assert) {
  TagInitializer.initialize(registry, application);

  let registered = Ember.A(factories.mapBy('name'));
  assert.ok(registered.contains('model:tags'), 'model:tags registered');
  assert.ok(registered.contains('service:tags'), 'service:tags registered');
  assert.ok(registered.contains('adapter:tags'), 'adapter:tags registered');
  assert.ok(registered.contains('serializer:tags'), 'serializer:tags registered');
  let msg = 'briefs injected into service:store';
  assert.equal(injections.findBy('factory', 'service:store').property, 'tags', msg);
  msg = 'serializer injected into service:tags';
  assert.equal(injections.findBy('factory', 'service:tags').property, 'serializer', msg);
});

function stub(app) {
  factories = Ember.A([]);
  injections = Ember.A([]);
  app.register = function(name, factory) {
    factories.push({name: name, factory: factory});
  };
  app.inject = function(factory, property, injection) {
    injections.push({
      factory: factory,
      property: property,
      injection: injection
    });
  };
  return app;
}
