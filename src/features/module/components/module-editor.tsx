"use client";

import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { EditableName } from "@/features/course/components/editable-name";
import type { ModuleDetail } from "@/server/services/module";
import { api } from "@/trpc/react";
import type { JSONContent } from "@tiptap/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function ModuleEditor({ module }: { module: ModuleDetail }) {
  const router = useRouter();
  const [hasChanges, setHasChanges] = useState(false);
  const [content, setContent] = useState<JSONContent | null>(
    module.content as JSONContent | null,
  );

  const updateModule = api.module.update.useMutation({
    onSuccess: () => {
      setHasChanges(false);
      router.refresh();
    },
  });

  const handleContentUpdate = useCallback((newContent: JSONContent) => {
    setContent(newContent);
    setHasChanges(true);
  }, []);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <Link
          href={`/courses/${module.courseId}`}
          className="text-theme-muted hover:text-theme-text mb-2 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="text-theme-primary size-4" />
          {module.courseName}
        </Link>

        <div className="flex items-start justify-between">
          <EditableName
            value={module.name}
            onSaveAction={(name) =>
              updateModule.mutate({ id: module.id, name })
            }
          />
          <Button
            variant="success"
            onClick={() => updateModule.mutate({ id: module.id, content })}
            disabled={!hasChanges || updateModule.isPending}
          >
            {updateModule.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <h2 className="font-theme-heading mb-3 shrink-0 text-lg font-semibold">
            Theory
          </h2>
          <div className="border-theme-border bg-theme-card min-h-0 flex-1 rounded-lg border">
            <TipTapEditor
              content={content!}
              onUpdateAction={handleContentUpdate}
            />
          </div>
        </div>

        <div className="text-theme-muted">Questions list placeholder</div>
        <div className="text-theme-muted">Dependencies placeholder</div>
      </div>
    </div>
  );
}
