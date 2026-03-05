import { useState } from "react";
import { Brain, Search, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchSimilarCases, type SearchResult } from "./vectorSearch";
import { generateLegalInsight } from "./geminiService";
import VectorSearchPanel from "./VectorSearchPanel";
import LLMInsightPanel from "./LLMInsightPanel";
import { motion } from "framer-motion";

/**
 * Legal Case Intelligence — Advanced AI page.
 * Allows judges to paste a case description, find similar cases via
 * vector search (cosine similarity), and generate AI legal insights
 * using Gemini 1.5 Flash.
 */
export default function AdvancedAIPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [insight, setInsight] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Main analysis workflow ---
  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setHasSearched(true);
    setSearchResults([]);
    setInsight("");

    // Step 1: Vector search
    setSearchLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network latency
    const results = searchSimilarCases(query, 5);
    setSearchResults(results);
    setSearchLoading(false);

    // Step 2: LLM insight generation
    setInsightLoading(true);
    try {
      const response = await generateLegalInsight(query, results);
      setInsight(response);
    } catch (err) {
      console.error("Insight generation failed:", err);
      setInsight("Failed to generate insight. Please try again.");
    }
    setInsightLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-display font-bold">Legal Case Intelligence</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered similar case discovery and legal insight generation.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Search,
            title: "Vector Search",
            desc: "Cosine similarity over case embeddings to find related precedents",
          },
          {
            icon: Brain,
            title: "LLM Reasoning",
            desc: "Gemini 1.5 Flash generates structured legal analysis",
          },
          {
            icon: FileText,
            title: "Case Intelligence",
            desc: "15 Indian High Court cases indexed for instant retrieval",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3"
          >
            <div className="rounded-md bg-primary/10 p-2">
              <f.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold">{f.title}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section 1 — Case Query Input */}
      <div className="stat-card">
        <label className="text-sm font-semibold flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          Enter Case Description
        </label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tenant eviction dispute due to unpaid rent for 8 months..."
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-muted-foreground">
            Describe the case facts, legal issues, or paste a case summary. Press Enter or click Analyze.
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={!query.trim() || searchLoading || insightLoading}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Analyze Case
          </Button>
        </div>
      </div>

      {/* Section 2 — Vector Search Results */}
      {(hasSearched || searchResults.length > 0) && (
        <VectorSearchPanel results={searchResults} loading={searchLoading} />
      )}

      {/* Section 3 — LLM Legal Insight */}
      {(insightLoading || insight) && (
        <LLMInsightPanel insight={insight} loading={insightLoading} />
      )}
    </div>
  );
}
