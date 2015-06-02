import ApplicationAdapter from 'ember-jsonapi-resources/adapters/application';
import config from 'pixelhandler-blog/config/environment';

export default ApplicationAdapter.extend({
  type: 'author',

  url: config.APP.API_PATH + '/authors',

  fetchUrl(url) {
    const proxy = config.APP.API_HOST_PROXY;
    const host = config.APP.API_HOST;
    if (proxy && host) {
      url = url.replace(proxy, host);
    }
    return url;
  }
});
