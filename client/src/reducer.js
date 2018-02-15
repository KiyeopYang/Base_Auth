import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import data from './data/reducer';
import landingPage from './scene/LandingPage/reducer';
import managerPage from './scene/ManagerPage/reducer';

export default combineReducers({
  routing: routerReducer,
  data,
  landingPage,
  managerPage,
});
