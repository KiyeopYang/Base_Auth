const version = '0.1';
const webpush = {
  client: '5a55888ebf36364e052586f5',
  redirectUrl: 'https://tracking.webpush.kr',
  fetchData: 'https://fetch.webpush.kr',
  logReciever: 'https://log.webpush.kr',
  campData: null,
  debug: true,
  log(a) {
    if (webpush.debug) {
      console.log(a);
    }
  },
};
webpush.redirectUrl += webpush.client;

webpush.log(`SW ${version} : Debug mode on`);

function getEndPoint(a) {
  let d = 'https://android.googleapis.com/gcm/send/',
    c = a.endpoint;
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1 &&
  (d = 'https://updates.push.services.mozilla.com/wpush/');
  if (c.indexOf(d) === 0)
    return c.replace(d, '');
  return a.endpoint;
}
function showNotification(push) {
  return self.registration.showNotification(push.title, {
    body: push.body,
    icon: push.icon,
    tag: push.tag,
    data: push,
  })
    .then(() => {})
}
self.addEventListener('push', (a) => {
  a.waitUntil(self.registration.pushManager.getSubscription().then((d) => {
    let t = {};
    try {
      t = a.data.json();
    } catch(e) {
      console.error(e);
      t.title = '알림';
      t.body = a.data.text();
    }
    if (t)
      try {
        if (Object.prototype.hasOwnProperty.call(t, 'merge')) {
          self.registration.getNotifications()
            .then(notifications => {
              let currentNotification;

              for(let i = 0; i < notifications.length; i++) {
                if (notifications[i].data &&
                  notifications[i].data.merge === t.merge) {
                  currentNotification = notifications[i];
                }
              }

              return currentNotification;
            })
            .then((currentNotification) => {
              if (currentNotification) {
                const messageCount = currentNotification.data.newMessageCount + 1;
                t.body = `${t.body}\n${messageCount}개의 알림이 왔습니다.`;
                t.newMessageCount = messageCount;
                currentNotification.close();
              } else {
                t.newMessageCount = 1;
              }
              return showNotification(t).then((a) => {});
            });
        } else {
          return showNotification(t).then((a) => {});
        }
      } catch (b) {
      }
  }));
});
self.addEventListener('notificationclick', (a) => {
  a.notification.close();
  const data = a.notification.data;
  console.log(data);
  if (data.redirect) {
    a.waitUntil(clients.matchAll({type: 'window'}).then((a) => {
      for (let c = 0; c < a.length; c++) {
        const b = a[c];
        if (b.url === data.redirect && 'focus' in b)
          return b.focus();
      }
      if (clients.openWindow)
        return clients.openWindow(data.redirect);
    }));
    // a.waitUntil(clients.matchAll({type: 'window'}).then((a) => {
    //   for (let c = 0; c < a.length; c++) {
    //     const b = a[c];
    //     console.log(a[c]);
    //     if (b.url === webpush.redirectUrl && 'focus' in b)
    //       return b.focus();
    //   }
    //   if (clients.openWindow)
    //     return clients.openWindow(webpush.redirectUrl);
    // }));
  }
});
