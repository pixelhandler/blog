import ApplicationAdapter from 'pixelhandler-blog/adapters/application';
import config from 'pixelhandler-blog/config/environment';

export default ApplicationAdapter.extend({
  type: 'commenter',
  url: config.APP.API_PATH + '/commenters'
});
