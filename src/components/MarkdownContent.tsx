/**
 * Lightweight markdown renderer for AI responses.
 * Handles bold, italic, headers, lists, code blocks, and line breaks.
 *
 * Safety: All input is HTML-escaped via escapeHtml() before any processing,
 * so dangerouslySetInnerHTML is safe here — no user-provided HTML can pass through.
 */
export function MarkdownContent({ content }: { content: string }) {
  const html = renderMarkdown(content);
  return (
    <div
      className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let inList = false;

  for (const line of lines) {
    // Code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        result.push("</code></pre>");
        inCodeBlock = false;
      } else {
        if (inList) {
          result.push("</ul>");
          inList = false;
        }
        result.push(
          '<pre class="bg-base-300 rounded p-2 my-2 overflow-x-auto text-xs"><code>'
        );
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      result.push(escapeHtml(line));
      result.push("\n");
      continue;
    }

    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      continue;
    }

    // Headers
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      const level = headerMatch[1].length;
      const sizes = [
        "text-lg font-bold mt-3 mb-1",
        "text-base font-bold mt-2 mb-1",
        "text-sm font-semibold mt-2 mb-1",
        "text-sm font-medium mt-1",
      ];
      result.push(
        `<div class="${sizes[level - 1]}">${renderInline(headerMatch[2])}</div>`
      );
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      result.push('<hr class="my-2 border-base-300" />');
      continue;
    }

    // Unordered list items
    const listMatch = trimmed.match(/^[-*+]\s+(.+)/);
    if (listMatch) {
      if (!inList) {
        result.push('<ul class="list-disc pl-4 my-1 space-y-0.5">');
        inList = true;
      }
      result.push(`<li class="text-sm">${renderInline(listMatch[1])}</li>`);
      continue;
    }

    // Numbered list
    const numListMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numListMatch) {
      if (!inList) {
        result.push('<ol class="list-decimal pl-4 my-1 space-y-0.5">');
        inList = true;
      }
      result.push(
        `<li class="text-sm">${renderInline(numListMatch[1])}</li>`
      );
      continue;
    }

    // Regular paragraph
    if (inList) {
      result.push("</ul>");
      inList = false;
    }
    result.push(`<p class="my-1 text-sm">${renderInline(trimmed)}</p>`);
  }

  if (inList) result.push("</ul>");
  if (inCodeBlock) result.push("</code></pre>");

  return result.join("\n");
}

function renderInline(text: string): string {
  let result = escapeHtml(text);

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Inline code
  result = result.replace(
    /`([^`]+)`/g,
    '<code class="bg-base-300 px-1 rounded text-xs">$1</code>'
  );

  return result;
}
