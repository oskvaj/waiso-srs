"use client";

import { api } from "@/trpc/react";
import { useEffect, useRef } from "react";

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

  const mutationRef = useRef(mutation);
  mutationRef.current = mutation;

  useEffect(() => {
    if (!hasRead) {
      mutationRef.current.mutate({
        courseId,
        moduleId,
      });
    }
  }, [courseId, moduleId, hasRead]);

  return null;
}
