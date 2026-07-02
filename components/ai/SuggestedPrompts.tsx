"use client";

/**
 * Swarna AI – Suggested Prompts Component
 * Horizontally scrollable chips with pre-defined questions.
 * Clicking a chip sends that question directly.
 */

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const SUGGESTED_PROMPTS = [
  "How do I join Rotaract?",
  "Who is the current President?",
  "Tell me about upcoming events.",
  "What projects has the club completed?",
  "Tell me about the latest project.",
  "How can I contact the board?",
  "What is Rotaract?",
  "Who are the board members?",
  "Show me past events.",
  "What are the club's service avenues?",
];

export default function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => !disabled && onSelect(prompt)}
          disabled={disabled}
          className={`
            flex-shrink-0 text-xs px-3 py-1.5 rounded-full border 
            border-amber-400/40 text-amber-300/90 bg-amber-400/5
            hover:bg-amber-400/15 hover:border-amber-400/70 hover:text-amber-200
            transition-all duration-200 whitespace-nowrap
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none focus:ring-1 focus:ring-amber-400/50
          `}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

// Inject no-scrollbar utility once (inline style approach for SSR compatibility)
export function NoScrollbarStyle() {
  return (
    <style>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}
