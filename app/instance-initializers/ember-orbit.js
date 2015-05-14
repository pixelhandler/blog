import Orbit from 'orbit';

export function initialize(application) {
  const primarySource = application.container.lookup('store:main').orbitSource;
  const secondarySource = application.container.lookup('store:secondary').orbitSource;
  //var localSource = container.lookup('store:local').orbitSource;
  // Connect (using default blocking strategy)
  new Orbit.TransformConnector(primarySource, secondarySource);
  new Orbit.TransformConnector(secondarySource, primarySource);
  // TODO figure out how to add a third store for localStorage
  //new Orbit.TransformConnector(secondarySource, localSource);
  primarySource.on('assistFind', secondarySource.find);
  //logTransforms(primarySource, 'store:main');
  //logTransforms(secondarySource, 'store:secondary');
  //logTransforms(localSource, 'store:local');
}

export default {
  name: 'ember-orbit',
  initialize: initialize
};

/*function logTransforms(source, name) {
  source.on('didTransform', function(operation) {
    console.log('[ORBIT.JS] [' + name + ']', operation);
  });
}*/
