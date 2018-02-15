import update from 'react-addons-update';
import {
  WAITING,
  SUCCESS,
  FAILURE,
} from './actions';

const initialState = {
  status: 'INIT',
  error: null,
  client: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WAITING:
      return update(state, {
        status: { $set: 'WAITING' },
        error: { $set: null },
      });
    case SUCCESS:
      return update(state, {
        status: { $set: 'SUCCESS' },
        error: { $set: null },
        client: { $set: action.client },
      });
    case FAILURE:
      return update(state, {
        status: { $set: 'FAILURE' },
        error: { $set: action.error },
        client: { $set: null },
      });
    default:
      return state;
  }
};
