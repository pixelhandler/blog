import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  type: 'post',

  url: config.APP.API_PATH + '/posts'
});
