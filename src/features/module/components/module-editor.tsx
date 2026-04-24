"use client";

import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { EditableName } from "@/features/course/components/editable-name";
import type { ModuleDetail } from "@/server/services/module";
import { api } from "@/trpc/react";
import type { JSONContent } from "@tiptap/react";
import { MoveLeft, SquarePen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function ModuleEditor({ module }: { module: ModuleDetail }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [content, setContent] = useState<JSONContent | null>(
    module.content as JSONContent | null,
  );

  const updateModule = api.module.update.useMutation({
    onSuccess: () => {
      setHasChanges(false);
      setEditing(false);
      router.refresh();
    },
  });

  const handleContentUpdate = useCallback((newContent: JSONContent) => {
    setContent(newContent);
    setHasChanges(true);
  }, []);

  function handleCancel() {
    setContent(module.content as JSONContent | null);
    setHasChanges(false);
    setEditing(false);
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="shrink-0">
        <Link
          href={`/courses/${module.courseId}`}
          className="text-theme-muted hover:text-theme-text mb-2 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <MoveLeft className="text-theme-primary size-6" />
          {module.courseName}
        </Link>

        <div className="flex items-start justify-between">
          <EditableName
            value={module.name}
            onSaveAction={(name) =>
              updateModule.mutate({ id: module.id, name })
            }
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mr-10 ml-5 flex h-10 shrink-0 items-center justify-between gap-3">
            <h2 className="font-theme-heading shrink-0 text-lg font-semibold">
              Theory
            </h2>
            {editing ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={() =>
                    updateModule.mutate({ id: module.id, content })
                  }
                  disabled={!hasChanges || updateModule.isPending}
                >
                  {updateModule.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-theme-primary hover:text-theme-primary/80 inline-flex items-center gap-1 px-2 py-1 font-bold transition-colors hover:cursor-pointer"
              >
                <SquarePen className="size-4" />
                Edit
              </button>
            )}
          </div>
          <div className="border-theme-border bg-theme-card min-h-0 flex-1 rounded-lg border">
            <TipTapEditor
              key={editing ? "edit" : "view"}
              content={content!}
              onUpdateAction={handleContentUpdate}
              editable={editing}
            />
          </div>
        </div>

        <div className="text-theme-muted">Questions list placeholder</div>
        <div className="text-theme-muted">Dependencies placeholder</div>
      </div>
    </div>
  );
}
