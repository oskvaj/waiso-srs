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
  useEffect(() => {
    if (!hasRead) {
      api.module.studentSetHasRead.useMutation().mutate({ courseId, moduleId });
    }
  }, []);

  return null;
}
