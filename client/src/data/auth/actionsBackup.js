/* global fetch */
import Promise from 'bluebird';
import config from '../../config';
import * as cookie from '../../modules/cookie';

export const WAITING = 'data/auth/WAITING';
export const SUCCESS = 'data/auth/SUCCESS';
export const FAILURE = 'data/auth/FAILURE';

const waiting = () => {
  return {
    type: WAITING,
  };
};
const success = (client) => {
  return {
    type: SUCCESS,
    client,
  };
};
const failure = (error) => {
  return {
    type: FAILURE,
    error,
  };
};
export const request = () => {
  return (dispatch) => {
    dispatch(waiting());
    return new Promise((resolve, reject) => {
      const apiKey = cookie.get('apiKey');
      if (!apiKey || apiKey === '') {
        return reject({ message: 'apiKey not found' });
      } else {
        return fetch(`${config.HOST}/api/client`, {
          method: 'GET',
          headers: {
            pragma: 'no-cache',
            'cache-control': 'no-cache',
            Authorization: `Bearer ${apiKey}`,
          },
        })
          .then((res) => {
            if (res.ok) { return resolve(res.json()); }
            return res.json().then((error) => {
              throw error;
            });
          })
          .catch(reject);
      }
    })
      .then((data) => {
        if (data) {
          if (data.success && Object.hasOwnProperty.call(data, 'client')) {
            return dispatch(success(data.client));
          } else {
            return dispatch(failure({ message: 'apiKey error' }));
          }
        }
        return dispatch(failure({
          message: 'response에 data가 없습니다.'
        }));
      })
      .catch(e => dispatch(failure(e)));
  };
};
export const logout = () => {
  return (dispatch) => {
    cookie.remove('apiKey');
    return dispatch(failure({ message: '로그아웃' }));
  };
};
