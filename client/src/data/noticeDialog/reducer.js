import update from 'react-addons-update';
import {
  ON,
  OFF,
} from './actions';

const initialState = {
  open: false,
  title: '',
  text: '',
  onConfirm: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON:
      return update(state, {
        open: { $set: action.open },
        title: { $set: action.title },
        text: { $set: action.text },
        onConfirm: { $set: action.onConfirm },
      });
    case OFF:
      return update(state, {
        open: { $set: false },
      });
    default:
      return state;
  }
};
