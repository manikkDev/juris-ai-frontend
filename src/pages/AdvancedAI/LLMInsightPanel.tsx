import { Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface LLMInsightPanelProps {
  insight: string;
  loading: boolean;
}

/**
 * Displays the AI-generated legal insight from Gemini (or local fallback).
 * Renders markdown-like content with styled formatting.
 */
export default function LLMInsightPanel({ insight, loading }: LLMInsightPanelProps) {
  if (loading) {
    return (
      <div className="stat-card">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          AI Legal Insight
        </h2>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="relative">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Generating legal insight with AI...</p>
          <p className="text-xs text-muted-foreground">Analyzing case similarity and legal precedents</p>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Legal Insight
        </h2>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Gemini 1.5 Flash
        </span>
      </div>

      {/* Render the insight with basic markdown-style formatting */}
      <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
        {insight.split("\n").map((line, i) => {
          // Heading level 3: ### ...
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="text-sm font-bold mt-4 mb-2 text-foreground">
                {line.replace("### ", "")}
              </h3>
            );
          }
          // Heading level 2: ## ...
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-base font-bold mt-4 mb-2 text-foreground">
                {line.replace("## ", "")}
              </h2>
            );
          }
          // Horizontal rule
          if (line.trim() === "---") {
            return <hr key={i} className="my-3 border-border" />;
          }
          // Blockquote
          if (line.startsWith("> ")) {
            return (
              <blockquote key={i} className="border-l-2 border-primary/30 pl-3 text-xs text-muted-foreground italic my-2">
                {renderInlineBold(line.replace("> ", ""))}
              </blockquote>
            );
          }
          // Numbered list item
          if (/^\d+\.\s/.test(line)) {
            return (
              <p key={i} className="text-sm ml-2 my-1">
                {renderInlineBold(line)}
              </p>
            );
          }
          // Bullet list item
          if (line.startsWith("- ")) {
            return (
              <p key={i} className="text-sm ml-4 my-0.5">
                • {renderInlineBold(line.replace("- ", ""))}
              </p>
            );
          }
          // Empty line
          if (line.trim() === "") {
            return <div key={i} className="h-2" />;
          }
          // Normal paragraph
          return (
            <p key={i} className="text-sm my-1">
              {renderInlineBold(line)}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}

/** Render **bold** segments within a line of text. */
function renderInlineBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
