import SocketSource from '../utils/socket-source';

export default {
  name: 'ember-orbit',

  initialize: function(container, application) {
    application.register('schema:main', EO.Schema);
    application.register('store:main', EO.Store.extend({
      orbitSourceClass: SocketSource,
      orbitSourceOptions: { idField: 'id' }
    }));
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
};
