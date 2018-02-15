/* global fetch */
import fetchHelper from '../../modules/fetchHelper';
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
  return async (dispatch) => {
    dispatch(waiting());
    try {
      const data = await fetchHelper({
        path: '/api/client',
        options: {
          autoAuth: true,
        },
      });
      const { client } = data;
      return dispatch(success(client));
    } catch (error) {
      return dispatch(failure(error));
    }
  };
};
export const logout = () => {
  return (dispatch) => {
    cookie.remove('apiKey');
    return dispatch(failure({ message: '로그아웃' }));
  };
};
