"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { api } from "@/trpc/react";
import {
  subscribeToPush,
  getExistingSubscription,
} from "@/lib/push-notifications";

export function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribeMutation = api.notification.subscribe.useMutation();

  useEffect(() => {
    if (typeof window === "undefined" || !("PushManager" in window)) return;

    const dismissed = localStorage.getItem("notification-prompt-dismissed");
    if (dismissed) return;

    void getExistingSubscription().then((sub) => {
      if (!sub) setShow(true);
    });
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShow(false);
        return;
      }

      const sub = await subscribeToPush();
      await subscribeMutation.mutateAsync(sub);
      setShow(false);
    } catch (error) {
      console.error("Push subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("notification-prompt-dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="bg-theme-card border-theme-border fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-xl border p-4 shadow-lg">
      <button
        onClick={handleDismiss}
        className="text-theme-muted hover:text-theme-text absolute top-3 right-3"
      >
        <X className="size-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="bg-theme-primary/10 rounded-full p-2">
          <Bell className="text-theme-primary size-5" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-theme-text text-sm font-medium">
            Stay on track with notifications
          </p>
          <p className="text-theme-muted text-xs">
            Get reminded when your reviews are ready so you never miss a
            session.
          </p>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleEnable} disabled={isLoading}>
              {isLoading ? "Enabling..." : "Enable"}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
