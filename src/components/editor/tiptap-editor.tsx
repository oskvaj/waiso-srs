"use client";

import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import Starterkit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Mathemathics from "@tiptap/extension-mathematics";
import { EditorToolbar } from "./editor-toolbar";

export function TipTapEditor({
  content,
  onUpdateAction: onUpdateAction,
  editable = true,
}: {
  content: JSONContent;
  onUpdateAction: (content: JSONContent) => void;
  editable?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      Starterkit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // use extension instead
      }),
      Underline,
      CodeBlock,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg",
        },
      }),
      Mathemathics,
    ],
    content: content ?? undefined,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdateAction?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none h-full px-4 py-3",
        style: "overflow-wrap: break-word; word-break: break-word;",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex h-full flex-col">
      {editable && <EditorToolbar editor={editor} />}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
