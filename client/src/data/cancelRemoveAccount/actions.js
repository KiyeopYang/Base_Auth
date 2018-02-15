/* global fetch */
import Promise from 'bluebird';
import config from '../../config';
import * as cookie from '../../modules/cookie';

export const WAITING = 'data/cancelRemoveAccount/WAITING';
export const SUCCESS = 'data/cancelRemoveAccount/SUCCESS';
export const FAILURE = '/data/cancelRemoveAccount/FAILURE';

const waiting = () => {
  return {
    type: WAITING,
  };
};
const success = () => {
  return {
    type: SUCCESS,
  };
};
const failure = (error) => {
  return {
    type: FAILURE,
    error,
  };
};
export const request = (input) => {
  return (dispatch) => {
    dispatch(waiting());
    return new Promise((resolve, reject) => {
      const apiKey = cookie.get('apiKey');
      if (!apiKey || apiKey === '') {
        return reject({ message: 'apiKey not found' });
      } else {
        return fetch(`${config.HOST}/api/client/remove/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(input),
        })
          .then((res) => {
            if (res.ok) {
              return resolve(res.json());
            }
            return res.json().then((error) => {
              throw error;
            });
          })
          .catch(reject);
      }
    })
      .then((data) => {
        if (data) {
          if (data.success) {
            return dispatch(success());
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