import { env } from "@/env";

export async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  const json = subscription.toJSON();

  return {
    endpoint: subscription.endpoint,
    p256dh: json.keys?.p256dh ?? "",
    auth: json.keys?.auth ?? "",
  };
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    return endpoint;
  }
  return null;
}

export async function getExistingSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}
