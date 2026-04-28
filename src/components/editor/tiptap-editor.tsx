import "katex/dist/katex.min.css";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import Starterkit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Mathematics from "@tiptap/extension-mathematics";
import { EditorToolbar } from "./editor-toolbar";
import { useCallback, useRef, useState } from "react";
import { MathDialog } from "./math-dialog";

type MathEditState = {
  latex: string;
  pos: number;
} | null;

export function TipTapEditor({
  content,
  onUpdate,
  editable = true,
}: {
  content: JSONContent;
  onUpdate: (content: JSONContent) => void;
  editable?: boolean;
}) {
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const [mathEdit, setMathEdit] = useState<MathEditState>(null);
  const [insertingMath, setInsertingMath] = useState(false);

  const handleMathClick = useCallback(
    (node: { attrs: Record<string, unknown> }, pos: number) => {
      if (!editable) return;
      setMathEdit({ latex: node.attrs.latex as string, pos });
    },
    [editable],
  );

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
      Mathematics.configure({
        katexOptions: {
          throwOnError: false,
        },
        inlineOptions: {
          onClick: (node, pos) => handleMathClick(node, pos),
        },
      }),
    ],
    content: content ?? undefined,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none h-full px-4 py-3",
        style: "overflow-wrap: break-word; word-break: break-word;",
      },
    },
  });

  editorRef.current = editor;

  if (!editor) return null;

  const dialogOpen = mathEdit !== null || insertingMath;

  return (
    <div className="flex h-full flex-col">
      {editable && (
        <EditorToolbar
          editor={editor}
          onInsertMath={() => setInsertingMath(true)}
        />
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <MathDialog
        open={dialogOpen}
        latex={mathEdit?.latex ?? ""}
        onSave={(latex) => {
          if (mathEdit) {
            editor
              .chain()
              .setNodeSelection(mathEdit.pos)
              .updateInlineMath({ latex })
              .focus()
              .run();
          } else {
            editor
              .chain()
              .focus()
              .insertContent({
                type: "inlineMath",
                attrs: { latex },
              })
              .run();
          }
          setMathEdit(null);
          setInsertingMath(false);
        }}
        onCancel={() => {
          setMathEdit(null);
          setInsertingMath(false);
        }}
      />
    </div>
  );
}
