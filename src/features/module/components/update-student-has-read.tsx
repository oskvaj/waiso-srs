"use client";

import { api } from "@/trpc/react";
import { useEffect } from "react";

export function MarkAsRead({
  courseId,
  moduleId,
  hasRead,
}: {
  courseId: string;
  moduleId: string;
  hasRead: boolean;
}) {
  const utils = api.useUtils();

  const mutation = api.module.studentSetHasRead.useMutation({
    onSuccess: () => {
      void utils.review.getReviewsDue.invalidate();
    },
  });

  useEffect(() => {
    if (!hasRead) {
      mutation.mutate({ courseId, moduleId });
    }
  }, []);

  return null;
}
