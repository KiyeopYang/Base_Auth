import { combineReducers } from 'redux';
import loader from './loader/reducer';
import noticeDialog from './noticeDialog/reducer';
import webPushSubscription from './webPushSubscription/reducer';
import webPush from './webPush/reducer';
import auth from './auth/reducer';
import requestPassword from './requestPassword/reducer';
import removeAccount from './removeAccount/reducer';
import cancelRemoveAccount from './cancelRemoveAccount/reducer';

export default combineReducers({
  loader,
  noticeDialog,
  webPushSubscription,
  webPush,
  auth,
  requestPassword,
  removeAccount,
  cancelRemoveAccount,
});
