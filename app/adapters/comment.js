import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  type: 'comment',

  url: config.APP.API_PATH + '/comments'
});
