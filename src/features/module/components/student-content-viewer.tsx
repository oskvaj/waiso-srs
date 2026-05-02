"use client";

import { TipTapEditor } from "@/components/editor/tiptap-editor";
import type { JSONContent } from "@tiptap/core";

export function ContentViewer({ content }: { content: unknown }) {
  return (
    <TipTapEditor
      content={content as JSONContent}
      onUpdate={() => {
        return;
      }}
      editable={false}
    />
  );
}
