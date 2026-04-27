"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export function DeleteQuestionDialog({
  questionId,
  questionName,
}: {
  questionId: string | undefined;
  questionName: string | undefined;
}) {
  const router = useRouter();

  // const publishCourse = api.course.publish.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //   },
  // });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete question
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Delete "${questionName}"?`}</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the question. You cannot undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => console.log("Delete question")}
            className="bg-theme-danger text-theme-inverse hover:bg-theme-danger/90"
          >
            Delete
            {/* {publishCourse.isPending ? "Publishing..." : "Publish"} */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
