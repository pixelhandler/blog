import ApplicationAdapter from 'pixelhandler-blog/adapters/application';
import config from 'pixelhandler-blog/config/environment';

export default ApplicationAdapter.extend({
  type: 'post',
  url: config.APP.API_PATH + '/posts'
});
