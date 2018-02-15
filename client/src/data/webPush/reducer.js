import update from 'react-addons-update';
import {
  TEST_WITHOUT_FILE_WAITING,
  TEST_WITHOUT_FILE_SUCCESS,
  TEST_WITHOUT_FILE_FAILURE,
  TEST_WITH_FILE_WAITING,
  TEST_WITH_FILE_SUCCESS,
  TEST_WITH_FILE_FAILURE,
} from './actions';

const initialState = {
  testWithoutFile: {
    status: 'INIT',
    error: null,
  },
  testWithFile: {
    status: 'INIT',
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TEST_WITHOUT_FILE_WAITING:
      return update(state, {
        testWithoutFile: {
          status: { $set: 'WAITING' },
          error: { $set: null },
        },
      });
    case TEST_WITHOUT_FILE_SUCCESS:
      return update(state, {
        testWithoutFile: {
          status: { $set: 'SUCCESS' },
          error: { $set: null },
        },
      });
    case TEST_WITHOUT_FILE_FAILURE:
      return update(state, {
        testWithoutFile: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error },
        },
      });
    case TEST_WITH_FILE_WAITING:
      return update(state, {
        testWithFile: {
          status: { $set: 'WAITING' },
          error: { $set: null },
        },
      });
    case TEST_WITH_FILE_SUCCESS:
      return update(state, {
        testWithFile: {
          status: { $set: 'SUCCESS' },
          error: { $set: null },
        },
      });
    case TEST_WITH_FILE_FAILURE:
      return update(state, {
        testWithFile: {
          status: { $set: 'FAILURE' },
          error: { $set: action.error },
        },
      });
    default:
      return state;
  }
};
