// @ts-nocheck

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  const title = data.title ?? "Waiso";
  const options = {
    body: data.body ?? "",
    icon: "/icons/manifest-icon-192.maskable.png",
    data: {
      url: data.url ?? "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationsClick", (event) => {
  event.notifications.close();

  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    }),
  );
});
