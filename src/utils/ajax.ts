import AjaxOptions from '../interfaces/ajax-options';
import { SuccessCallback, FailureCallback } from '../types/callbacks';
import { serverError } from './errors';
import constants from './constants';

import Resources from '../types/resources';
import Resource from '../types/resource';
import Record from '../types/record';

const ajax: (o: AjaxOptions, s: SuccessCallback, f?: FailureCallback)=>void =
  function (opts: AjaxOptions, success: SuccessCallback, failure?: FailureCallback): void {
    if (!opts || !opts.endpoint) { throw('ajax requires an endpoint property'); }
    const request = new XMLHttpRequest();
    const params = encodeURI(opts.params || '');
    const url = constants.api.url + opts.endpoint + params;
    request.open(opts.method, url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        success(request.responseText);
      } else {
        if (typeof failure === 'function') {
          failure(request.status, request.responseText);
        } else {
          if (request.status >= 500) {
            success(serverError());
          } else {
            throw('failed to ' + opts.method + ' ' + url);
          }
        }
      }
    };
    request.onerror = function() {
      const err = serverError();
      return (typeof failure === 'function') ? failure(request.status, err) : success(err);
    };
    request.send();
  };

export default ajax;