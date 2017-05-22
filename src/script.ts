import ready from './utils/ready';
import start from './application/start';
import {
  setupFormListeners, setupHistoryListener, setupColumnControlListener,
} from './application/listeners';
import { removePreloadClass } from './utils/helpers';

ready(function() {
  start().then(function() {
    setupFormListeners();
    setupHistoryListener();
    setupColumnControlListener();
    removePreloadClass();
  });
});
