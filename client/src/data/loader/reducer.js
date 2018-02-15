import { ON, OFF } from './actions';

const initialState = false;
const loading = (state, action) => {
  switch (action.type) {
    case ON:
      return true;
    case OFF:
      return false;
    default:
      return state;
  }
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return loading(state, action);
  }
};
