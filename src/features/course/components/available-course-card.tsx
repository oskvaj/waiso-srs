"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import type { PublicCourseListItem } from "@/server/services/course";

export function AvailableCourseCard({
  course,
}: {
  course: PublicCourseListItem;
}) {
  const router = useRouter();

  const joinMutation = api.course.join.useMutation({
    onSuccess: async () => {
      router.refresh();
      router.push("/course");
    },
  });

  return (
    <Card variant="raised" className="flex h-56 flex-col p-4">
      <h3 className="font-theme-heading line-clamp-2 shrink-0 text-lg font-semibold">
        {course.name}
      </h3>
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        {course.description && (
          <p className="text-theme-muted text-sm">{course.description}</p>
        )}
      </div>
      <div className="mt-3 shrink-0">
        <Button
          size="sm"
          onClick={() => joinMutation.mutate({ courseId: course.id })}
          disabled={joinMutation.isPending}
        >
          {joinMutation.isPending ? "Joining..." : "Join course"}
        </Button>
      </div>
    </Card>
  );
}
