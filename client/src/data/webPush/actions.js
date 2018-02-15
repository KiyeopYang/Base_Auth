/* global fetch */
import config from '../../config';

function getSubscriptionFromState (state) {
  let subscription;
  const { webPushSubscription } = state.data;
  if (webPushSubscription.status === 'SUBSCRIBED') {
    subscription = {};
    subscription.endpoint = webPushSubscription.endpoint;
    subscription.keys = webPushSubscription.keys;
  }
  return subscription;
}


export const TEST_WITHOUT_FILE_WAITING = 'data/webpush/TEST_WITHOUT_FILE_WAITING';
export const TEST_WITHOUT_FILE_SUCCESS = 'data/webpush/TEST_WITHOUT_FILE_SUCCESS';
export const TEST_WITHOUT_FILE_FAILURE = 'data/webpush/TEST_WITHOUT_FILE_FAILURE';
const testWithoutFileWaiting = () => {
  return {
    type: TEST_WITHOUT_FILE_WAITING,
  };
};
const testWithoutFileSuccess = () => {
  return {
    type: TEST_WITHOUT_FILE_SUCCESS,
  };
};
const testWithoutFileFailure = (error) => {
  return {
    type: TEST_WITHOUT_FILE_FAILURE,
    error,
  };
};
export const testWithoutFileRequest = ({ push, endpoint, keys }) => {
  return (dispatch, getState) => {
    dispatch(testWithoutFileWaiting());
    let subscription = {
      endpoint,
      keys,
    };
    if (!endpoint || !keys) {
      subscription = getSubscriptionFromState(getState());
    }
    return fetch(`${config.HOST}/api/webpush/testWithoutFile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        push,
      }),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((data) => {
        if (data) {
          return dispatch(testWithoutFileSuccess(data));
        }
        return dispatch(testWithoutFileFailure({
          message: 'response에 data가 없습니다.'
        }));
      })
      .catch(e => dispatch(testWithoutFileFailure(e)));
  };
};

export const TEST_WITH_FILE_WAITING = 'data/webpush/TEST_WITH_FILE_WAITING';
export const TEST_WITH_FILE_SUCCESS = 'data/webpush/TEST_WITH_FILE_SUCCESS';
export const TEST_WITH_FILE_FAILURE = 'data/webpush/TEST_WITH_FILE_FAILURE';
const testWithFileWaiting = () => {
  return {
    type: TEST_WITH_FILE_WAITING,
  };
};
const testWithFileSuccess = () => {
  return {
    type: TEST_WITH_FILE_SUCCESS,
  };
};
const testWithFileFailure = (error) => {
  return {
    type: TEST_WITH_FILE_FAILURE,
    error,
  };
};
export const testWithFileRequest = (
  { push, endpoint, keys }, { fileBlob, fileName }
) => {
  return (dispatch, getState) => {
    dispatch(testWithFileWaiting());
    let subscription = {
      endpoint,
      keys,
    };
    if (!endpoint || !keys) {
      subscription = getSubscriptionFromState(getState());
    }
    const formData = new FormData();
    formData.append(
      'icon',
      fileBlob,
      fileName,
    );
    formData.append(
      'subscription',
      JSON.stringify(subscription),
    );
    formData.append(
      'push',
      JSON.stringify(push),
    );
    return fetch(`${config.HOST}/api/webpush/testWithFile`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((data) => {
        if (data) {
          return dispatch(testWithFileSuccess(data));
        }
        return dispatch(testWithFileFailure({
          message: 'response에 data가 없습니다.'
        }));
      })
      .catch(e => dispatch(testWithFileFailure(e)));
  };
};
