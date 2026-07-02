"use client";

import { useState, useCallback } from "react";

/**
 * Swarna AI – Chat Message Component
 *
 * Renders a single chat message bubble with:
 * - Role-based styling (user vs AI)
 * - Lightweight markdown rendering (bold, italic, lists, inline code, links)
 * - Copy-to-clipboard button for AI messages
 * - Smooth fade-in animation
 */

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

// ---------------------------------------------------------------------------
// Lightweight Markdown Renderer
// ---------------------------------------------------------------------------
// Converts basic markdown to React-compatible HTML string.
// Supported: **bold**, *italic*, `code`, bullet lists, numbered lists, links
// This avoids installing react-markdown while keeping formatting clean.

function renderMarkdown(text: string): string {
  let html = text;

  // Escape HTML first to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings (##, ###)
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-amber-300 font-semibold text-sm mt-3 mb-1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-amber-300 font-semibold text-base mt-3 mb-1">$1</h2>');

  // Bold **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic *text* (not inside bold)
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  // Inline code `code`
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-white/10 text-amber-200 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>'
  );

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-300 underline underline-offset-2 hover:text-amber-200">$1</a>'
  );

  // Bare URLs
  html = html.replace(
    /(?<!["\(])(https?:\/\/[^\s<>"]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-amber-300 underline underline-offset-2 hover:text-amber-200">$1</a>'
  );

  // Email addresses
  html = html.replace(
    /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1" class="text-amber-300 underline underline-offset-2 hover:text-amber-200">$1</a>'
  );

  // Bullet lists (• or - or *)
  html = html.replace(
    /^[•\-\*] (.+)$/gm,
    '<li class="ml-4 list-disc text-slate-200">$1</li>'
  );

  // Numbered lists (1. 2. etc)
  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="ml-4 list-decimal text-slate-200">$1</li>'
  );

  // Wrap consecutive <li> in <ul>/<ol>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-2 space-y-0.5">$1</ul>');

  // Horizontal rule ---
  html = html.replace(/^---+$/gm, '<hr class="border-white/10 my-3" />');

  // Paragraphs — wrap double newlines
  html = html.replace(/\n\n+/g, "</p><p class=\"mb-2\">");
  html = "<p class=\"mb-2\">" + html + "</p>";

  // Single newlines to <br> (but not inside block elements)
  html = html.replace(/([^>])\n([^<])/g, "$1<br />$2");

  return html;
}

// ---------------------------------------------------------------------------
// Copy Button
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy response"}
      className="
        opacity-0 group-hover:opacity-100 transition-all duration-200
        text-slate-400 hover:text-amber-300 p-1 rounded
        focus:outline-none focus:ring-1 focus:ring-amber-400/50
      "
      aria-label="Copy response to clipboard"
    >
      {copied ? (
        // Checkmark icon
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        // Copy icon
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-3 animate-slide-up">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div
            className="
              bg-gradient-to-br from-[#0F3B82] to-[#1a4fa8]
              text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm
              shadow-lg shadow-blue-900/30
              leading-relaxed
            "
          >
            {content}
          </div>
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex justify-start mb-3 animate-slide-up group">
      {/* AI Avatar */}
      <div className="flex-shrink-0 mr-2.5 mt-0.5">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
          <img
            src="/favicon.png"
            alt="Swarna AI"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-[82%] sm:max-w-[75%]">
        {/* Bubble */}
        <div
          className="
            bg-white/5 backdrop-blur-sm
            border border-white/10
            text-slate-100 text-sm px-4 py-3
            rounded-2xl rounded-tl-sm
            shadow-lg
            leading-relaxed
          "
        >
          {/* Streaming cursor */}
          {isStreaming && !content && (
            <span className="inline-block w-1.5 h-4 bg-amber-400/70 rounded-sm animate-pulse" />
          )}

          {content && (
            <div
              className="prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}

          {/* Streaming cursor at end */}
          {isStreaming && content && (
            <span className="inline-block w-1.5 h-4 bg-amber-400/70 rounded-sm animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {/* Action bar — visible on hover */}
        {!isStreaming && content && (
          <div className="flex items-center mt-1 ml-1 gap-1">
            <CopyButton text={content} />
          </div>
        )}
      </div>
    </div>
  );
}
