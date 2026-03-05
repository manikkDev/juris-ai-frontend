import { Search, Scale, Building, Calendar, BarChart3 } from "lucide-react";
import type { SearchResult } from "./vectorSearch";
import { motion } from "framer-motion";

interface VectorSearchPanelProps {
  results: SearchResult[];
  loading: boolean;
}

/**
 * Displays vector similarity search results as cards.
 * Each card shows case title, court, year, and similarity score.
 */
export default function VectorSearchPanel({ results, loading }: VectorSearchPanelProps) {
  if (loading) {
    return (
      <div className="stat-card">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          Similar Cases Found
        </h2>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Searching vector space for similar cases...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div className="stat-card">
      <h2 className="text-base font-semibold flex items-center gap-2 mb-1">
        <Search className="h-5 w-5 text-primary" />
        Similar Cases Found
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Top {results.length} results ranked by cosine similarity to your query embedding.
      </p>

      <div className="grid gap-3">
        {results.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="border border-border/60 rounded-lg p-4 bg-background hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Case title */}
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="text-sm font-semibold truncate">{r.case_title}</h3>
                </div>

                {/* Metadata row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5" />
                    {r.court}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {r.year}
                  </span>
                </div>

                {/* Summary preview */}
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.summary}</p>
              </div>

              {/* Similarity score badge */}
              <div className="shrink-0 flex flex-col items-center gap-1">
                <div
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg ${
                    r.similarity >= 0.85
                      ? "bg-green-100 text-green-700"
                      : r.similarity >= 0.75
                      ? "bg-blue-100 text-blue-700"
                      : r.similarity >= 0.65
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  {r.similarity.toFixed(2)}
                </div>
                <span className="text-[10px] text-muted-foreground">similarity</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
