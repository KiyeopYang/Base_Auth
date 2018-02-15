/* global fetch */
import Promise from 'bluebird';
import update from 'react-addons-update';
import config from '../config';
import * as cookie from './cookie';

function hasProperty(a, b) {
  return Object.hasOwnProperty.call(a,b);
}
export default function({ host, path, fetchOptions, options = {} }) {
  return new Promise(async (resolve, reject) => {
    let customHeaders;
    const autoAuth = hasProperty(options, 'autoAuth') && options.autoAuth;
    if (autoAuth) {
      const apiKey = cookie.get('apiKey');
      const Authorization = `Bearer ${apiKey}`;
      if (fetchOptions && fetchOptions.headers) {
        customHeaders = update(fetchOptions.headers, { Authorization });
      } else {
        customHeaders = { Authorization };
      }
      if (!apiKey) {
        return reject({ message: 'API KEY NOT FOUND' });
      }
    }
    try {
      const url = `${host || config.HOST}${path}`;
      let res;
      if (!customHeaders && !fetchOptions) res = await fetch(url);
      else if (customHeaders && !fetchOptions) res = await fetch(url, { headers: customHeaders });
      else if (!customHeaders && fetchOptions)  res = await fetch(url, fetchOptions);
      else res = await fetch(url, update(fetchOptions, { headers: customHeaders }));
      try {
        const json = await res.json();
        return res.ok ? resolve(json) : reject(json);
      } catch (error) {
        return reject({ message: res.statusText });
      }
    } catch (error) {
      return reject(error);
    }
  });
}
