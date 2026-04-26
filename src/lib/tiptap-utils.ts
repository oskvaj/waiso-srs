import type { JSONContent } from "@tiptap/react";

export function extractTextFromContent(
  content: JSONContent,
  maxLength = 200,
): string {
  const parts: string[] = [];

  function walk(node: JSONContent) {
    if (node.text) parts.push(node.text);
    if (node.content) node.content.forEach(walk);
  }

  walk(content);
  const text = parts.join(" ").trim();

  if (!text) return "Untitled question";

  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}
