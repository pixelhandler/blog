import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
  type: 'tag',

  url: config.APP.API_PATH + '/tags'
});
