import EO from 'ember-orbit';
import { SocketService, canUseSocket } from '../services/socket';

export default {
  name: 'socket',

  initialize: function (container, app) {
    if (!canUseSocket()) { return; }
    //container.register('socket:main', SocketService, { singleton: false });
    //app.inject('controller', 'socket', 'socket:main');
    //app.inject('route', 'socket', 'socket:main');
    //EO.Model.reopenClass({
      //socket: container.lookup('socket:main')
    //});
  }
};
