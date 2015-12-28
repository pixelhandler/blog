import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  type: 'commenter',

  url: config.APP.API_PATH + '/commenters'
});
