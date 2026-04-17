"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function NewCourseDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const createCourse = api.course.create.useMutation({
    onSuccess: (data) => {
      setOpen(false);
      void router.push(`/courses/${data.id}`);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    createCourse.mutate({
      name,
      description: description || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-xl"
        onCloseAutoFocus={() => {
          setName("");
          setDescription("");
        }}
      >
        <DialogHeader>
          <DialogTitle>Create new course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-name">Name</Label>
            <Input
              id="course-name"
              placeholder="Course name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-description">
              Description{" "}
              <span className="text-theme-muted font-normal">(optional)</span>
            </Label>
            <Textarea
              id="course-description"
              placeholder="What will students learn in this course?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              autoComplete="off"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="action"
              disabled={!name.trim() || createCourse.isPending}
            >
              {createCourse.isPending ? "Creating..." : "Create course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
