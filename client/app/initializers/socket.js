import SocketService from '../services/socket';

export default {
  name: 'socket',

  initialize: function(container, application) {
    container.register('service:socket', SocketService, { singleton: false });
    application.inject('route', 'socket', 'service:socket');
    application.inject('controller', 'socket', 'service:socket');
  }
};
