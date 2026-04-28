import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  CodeSquare,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Sigma,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";

export function EditorToolbar({
  editor,
  onInsertMath,
  onInsertImage,
}: {
  editor: Editor;
  onInsertMath: () => void;
  onInsertImage: () => void;
}) {
  return (
    <div className="border-theme-border bg-theme-card sticky top-0 z-10 flex flex-wrap gap-0.5 rounded-t-lg border-b px-2 py-1.5">
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <Underline className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <Code className="size-4" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered list"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <CodeSquare className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus className="size-4" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton onClick={onInsertImage} title="Insert image">
          <ImagePlus className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={onInsertMath} title="Insert math formula">
          <Sigma className="size-4" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="size-4" />
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded p-1.5 transition-colors ${active ? "bg-theme-primary/10 text-theme-primary" : "text-theme-muted hover:bg-theme-subtle hover:text-theme-text"} ${disabled ? "cursor-not-allowed opacity-30" : "hover:cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="bg-theme-border mx-1 h-6 w-px" />;
}
