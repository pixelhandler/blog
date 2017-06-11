import Url from '../interfaces/url';

// Polyfill for URL
const url: (url: string)=>Url =
  function (url: string): Url {
    let _url: Url;
    if (window.URL && window.URL.prototype && ('href' in window.URL.prototype)) {
      _url = new URL(url);
    } else {
      const search = url.split('?')[1];
      const pathname = url.split('//')[1].split('/')[1].split('?')[0];
      _url = {
        search: search ? `?${search}` : '',
        pathname: pathname ? `/${pathname}` : '/',
      };
    }
    return _url;
  };

export default url;