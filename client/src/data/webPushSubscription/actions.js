/* global
 window,
 ServiceWorkerRegistration,
 navigator,
 Notification,
 btoa
*/
function makeKey(sub) {
  const rawKey = sub.getKey ? sub.getKey('p256dh') : '';
  const key = rawKey ?
    btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
  const rawAuthSecret = sub.getKey ? sub.getKey('auth') : '';
  const authSecret = rawAuthSecret ?
    btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
  const endpoint = sub.endpoint;
  return {
    endpoint,
    keys: {
      key,
      authSecret,
    },
  };
}
function getSubscription() {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.pushManager.getSubscription()
          .then((subscription) => {
            if (subscription) {
              resolve(makeKey(subscription));
            } else {
              registration.pushManager.subscribe({
                userVisibleOnly: true,
              })
                .then(subscription => resolve(makeKey(subscription)))
                .catch(reject);
            }
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

export const UNSUPPORTED = 'data/webPushSubscriptionSubscription/UNSUPPORTED';
export const DENIED = 'data/webPushSubscriptionSubscription/DENIED';
export const GRANTED = 'data/webPushSubscription/GRANTED';
export const PROMPT = 'data/webPushSubscription/PROMPT';
export const IDLE = 'data/webPushSubscription/IDLE';
export const SUBSCRIBED = 'data/webPushSubscription/SUBSCRIBED';

const unsupported = () => ({
  type: UNSUPPORTED,
  error: {
    title: '웹 푸시 불가',
    text: '브라우저에서 지원하지 않습니다.\n' +
    '크롬, 삼성브라우저, 맥북 사파리, 파이어폭스, 오페라를 지원합니다.',
  },
});
const denied = () => ({
  type: DENIED,
  error: {
    title: '웹 푸시 불가',
    text: '권한이 거부되었습니다. 브라우저 설정을 변경하십시요.',
  },
});
const granted = () => ({
  type: GRANTED,
});
const prompt = () => ({
  type: PROMPT,
});
const idle = () => ({
  type: IDLE,
  error: {
    title: '웹 푸시 불가',
    text: '다시 한번 시도하여 주십시요.',
  },
});
const subscribed = (endpoint, keys) => ({
  type: SUBSCRIBED,
  endpoint,
  keys,
});

export const subscribeWebPush = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      // 웹 푸시 구독 프로세스 시작
      if (
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !('showNotification' in ServiceWorkerRegistration.prototype)
      ) {
        // 웹 푸시 지원 X
        return reject(dispatch(unsupported()));
      }
      // 웹 푸시 알림 권한
      const { permission } = Notification;
      if (permission === 'default') {
        // 초기 상태 시, 허용 요청 띄우기
        dispatch(prompt());
        // 웹 푸시 알림 인지를 위한 시간 차
        return Notification.requestPermission((result) => {
            if (result === 'default') {
              // 아무 버튼 선택 안함 -> 재요청 가능하도록 (chrome 에선 3번 같은 경우 시, 자동 denied)
              return reject(dispatch(idle()));
            } else if (result === 'denied') {
              // 거부 선택
              return reject(dispatch(denied()));
            }
            // 허용 선택
            dispatch(granted());
            return getSubscription()
              .then((subscription) => {
                // 구독 완료
                return resolve(dispatch(subscribed(subscription.endpoint, subscription.keys)));
              })
              .catch(reject);
          });
      } else if (permission === 'denied') {
        // 이미 거부된 상태
        return reject(dispatch(denied()));
      }
      // 이미 허용된 상태
      dispatch(granted());
      return getSubscription()
        .then((subscription) => {
          // 구독 완료
          return resolve(dispatch(subscribed(subscription.endpoint, subscription.keys)));
        })
        .catch(reject);
    })
  };
};
