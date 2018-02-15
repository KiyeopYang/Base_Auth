/* global fetch */
import config from '../../../../../../config';
import * as cookie from '../../../../../../modules/cookie';

export const WAITING = 'LandingPage/Start/data/signUp/WAITING';
export const SUCCESS = 'LandingPage/Start/data/signUp/SUCCESS';
export const FAILURE = 'LandingPage/Start/data/signUp/FAILURE';

const waiting = () => {
  return {
    type: WAITING,
  };
};
const success = ({ apiKey }) => {
  return {
    type: SUCCESS,
    apiKey,
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
    return fetch(`${config.HOST}/api/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((data) => {
        if (data) {
          const { apiKey } = data;
          cookie.set('apiKey', apiKey);
          return dispatch(success({ apiKey }));
        }
        return dispatch(failure({
          message: 'response에 data가 없습니다.'
        }));
      })
      .catch(e => dispatch(failure(e)));
  };
};