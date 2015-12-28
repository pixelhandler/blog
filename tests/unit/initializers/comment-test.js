import Ember from 'ember';
import CommentInitializer from '../../../initializers/comment';
import { module, test } from 'qunit';

let registry, application, factories, injections;

module('Unit | Initializer | comment', {
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

test('it registers comments factories: model, service, adapter, serializer; injects: service, serializer', function(assert) {
  CommentInitializer.initialize(registry, application);

  let registered = Ember.A(factories.mapBy('name'));
  assert.ok(registered.contains('model:comments'), 'model:comments registered');
  assert.ok(registered.contains('service:comments'), 'service:comments registered');
  assert.ok(registered.contains('adapter:comments'), 'adapter:comments registered');
  assert.ok(registered.contains('serializer:comments'), 'serializer:comments registered');
  let msg = 'briefs injected into service:store';
  assert.equal(injections.findBy('factory', 'service:store').property, 'comments', msg);
  msg = 'serializer injected into service:comments';
  assert.equal(injections.findBy('factory', 'service:comments').property, 'serializer', msg);
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
