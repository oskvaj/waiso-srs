"use client";

import {
  getExistingSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-notifications";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function NotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const subscribeMutation = api.notification.subscribe.useMutation();
  const unsubscribeMutation = api.notification.unsubscribe.useMutation();

  useEffect(() => {
    if (typeof window !== "undefined" && "PushManager" in window) {
      setIsSupported(true);
      void getExistingSubscription()
        .then((sub) => setIsSubscribed(!!sub))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isSupported) return null;

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        const endpoint = await unsubscribeFromPush();
        if (endpoint) {
          await unsubscribeMutation.mutateAsync({ endpoint });
        }
        setIsSubscribed(false);
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const sub = await subscribeToPush();
        await subscribeMutation.mutateAsync(sub);
        setIsSubscribed(true);
      }
    } catch (e) {
      console.error("Push subscription error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Label htmlFor="push-notifications" className="text-sm">
        Push notifications
      </Label>
      <Switch
        id="push-notifications"
        checked={isSubscribed}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
    </div>
  );
}
