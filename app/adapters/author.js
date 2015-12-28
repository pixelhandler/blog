import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  type: 'author',

  url: config.APP.API_PATH + '/authors'
});
