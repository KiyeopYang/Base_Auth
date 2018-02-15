import update from 'react-addons-update';
import {
  UNSUPPORTED,
  DENIED,
  GRANTED,
  PROMPT,
  IDLE,
  SUBSCRIBED,
} from './actions';

const initialState = {
  status: 'INIT',
  endpoint: null,
  keys: null,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UNSUPPORTED:
      return update(state, {
        status: { $set: 'UNSUPPORTED' },
        endpoint: { $set: null },
        keys: { $set: null },
        error: { $set: action.error },
      });
    case DENIED:
      return update(state, {
        status: { $set: 'DENIED' },
        endpoint: { $set: null },
        keys: { $set: null },
        error: { $set: action.error },
      });
    case GRANTED:
      return update(state, {
        status: { $set: 'GRANTED' },
      });
    case PROMPT:
      return update(state, {
        status: { $set: 'PROMPT' },
      });
    case IDLE:
      return update(state, {
        status: { $set: 'IDLE' },
        error: { $set: action.error },
      });
    case SUBSCRIBED:
      return update(state, {
        status: { $set: 'SUBSCRIBED' },
        endpoint: { $set: action.endpoint },
        keys: { $set: action.keys },
      });
    default:
      return state;
  }
};
