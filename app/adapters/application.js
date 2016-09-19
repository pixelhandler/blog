import ApplicationAdapter from 'ember-jsonapi-resources/adapters/application';
import config from '../config/environment';

export default ApplicationAdapter.extend({

  fetchUrl: function(url) {
    const proxy = config.APP.API_HOST_PROXY;
    const host = config.APP.API_HOST;
    if (proxy && url.match(proxy) !== null && host) {
      url = url.replace(proxy, host);
    } else if (host && url.match(host) === null) {
      url = `${host}/${url}`;
    }
    return url;
  }
});
