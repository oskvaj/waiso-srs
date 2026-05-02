"use client";

import { api } from "@/trpc/react";

export function TestPushButton() {
  const testPush = api.notification.testPush.useMutation();

  return (
    <button
      onClick={() => testPush.mutate()}
      disabled={testPush.isPending}
      className="bg-theme-action text-theme-inverse rounded-md px-3 py-1.5 disabled:opacity-50"
    >
      {testPush.isPending ? "Sending..." : "Test notification"}
    </button>
  );
}
