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
  courseId,
  moduleId,
}: {
  questionId: string;
  questionName: string;
  courseId: string;
  moduleId: string;
}) {
  const router = useRouter();

  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      void router.push(`/courses/${courseId}/modules/${moduleId}`);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="hover:cursor-pointer"
        >
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
            onClick={() => deleteQuestion.mutate({ id: questionId })}
            className="bg-theme-danger text-theme-inverse hover:bg-theme-danger/90 hover:cursor-pointer"
          >
            {deleteQuestion.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
