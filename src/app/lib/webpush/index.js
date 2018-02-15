import webpush from 'web-push';

const GCM_API_KEY = 'AAAATCNfU6I:APA91bGb75nkccXKjHkIHQdhWnuLqlVsnBVxk40n3WY8xqce-sgCgLubbwRDtGAurUjnX1bdzGkeOF8EpLJ63UUtBql5TIH4jL0xoSA4vFrNMZQ99DubIQG7Ph_wMTGxN0g6oClnDP7f';

webpush.setGCMAPIKey(GCM_API_KEY);

function handlePracticePush({ subscription, push }) {
  return new Promise((resolve, reject) => {
    const { endpoint, keys } = subscription;
    const { key, authSecret } = keys;
    const pushJSON = push;
    pushJSON.redirect = push.redirectUrl;
    webpush.sendNotification({
      endpoint,
      TTL: 0,
      keys: {
        p256dh: key,
        auth: authSecret,
      },
    }, JSON.stringify(pushJSON))
      .then(resolve)
      .catch(reject);
  });
}

export default handlePracticePush;
