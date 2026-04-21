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
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddModuleDialog({
  courseId,
  children,
}: {
  courseId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const createModule = api.module.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-lg"
        onCloseAutoFocus={() => {
          setName("");
        }}
      >
        <DialogHeader>
          <DialogTitle>Add new module</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            createModule.mutate({ courseId, name });
          }}
          className="min-w-0 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="module-name">Name</Label>
            <Input
              id="module-name"
              placeholder="e.g. Logical gates"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
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
              disabled={!name.trim() || createModule.isPending}
            >
              {createModule.isPending ? "Creating..." : "Add module"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
