"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

export function DeleteCourseDialog({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName: string;
}) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  const deleteCourse = api.course.delete.useMutation({
    onSuccess: () => {
      void router.push("/courses");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const nameMatches = confirmation === courseName;

  return (
    <AlertDialog
      onOpenChange={() => {
        setConfirmation("");
        setError("");
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete course
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Delete "${courseName}"?`}`</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the course and all its modules and
            questions. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="confirm-name">
            Type <span className="font-semibold">{courseName}</span> to confirm
          </Label>
          <Input
            id="confirm-name"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={courseName}
            autoComplete="off"
          />
        </div>
        {error && <p className="text-theme-danger text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => deleteCourse.mutate({ id: courseId })}
            disabled={!nameMatches || deleteCourse.isPending}
          >
            {deleteCourse.isPending ? "Deleting..." : "Delete course"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
