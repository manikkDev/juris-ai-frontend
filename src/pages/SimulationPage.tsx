import { useState } from "react";
import { useCases } from "@/hooks/useFirestoreData";
import { Button } from "@/components/ui/button";
import { FlaskConical, TrendingDown, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function SimulationPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<null | { backlogReduction: number; timeSaved: number; casesResolved: number }>(null);
  const { cases, loading, error } = useCases();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm">Loading simulation data from Firestore...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3 max-w-md">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold">Failed to load simulation data</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const topCases = [...cases].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 10);

  const runSimulation = () => {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      setResults({
        backlogReduction: Math.round(18 + Math.random() * 12),
        timeSaved: Math.round(45 + Math.random() * 30),
        casesResolved: topCases.length,
      });
      setRunning(false);
    }, 2000);
  };

  const comparisonData = topCases.map((c) => ({
    name: c.caseNumber.split("/").pop(),
    before: c.priorityScore,
    after: Math.max(10, c.priorityScore - Math.round(20 + Math.random() * 30)),
  }));

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold">AI Simulation</h1>
        <p className="text-sm text-muted-foreground">Simulate fast-tracking high-priority cases</p>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">Fast Track Top 10 Cases</h3>
          </div>
          <Button onClick={runSimulation} disabled={running}>
            {running ? "Simulating..." : "Run Simulation"}
          </Button>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Case Number</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Priority</th>
                <th className="pb-2 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {topCases.map((c) => (
                <tr key={c.caseId} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono">{c.caseNumber}</td>
                  <td className="py-2 pr-4">{c.caseType}</td>
                  <td className="py-2 pr-4 font-bold">{c.priorityScore}</td>
                  <td className="py-2">{(c.adjournmentRisk * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Backlog Reduction" value={`${results.backlogReduction}%`} icon={TrendingDown} color="success" />
              <StatCard title="Time Saved" value={`${results.timeSaved} days`} icon={Clock} color="info" />
              <StatCard title="Cases Resolved" value={results.casesResolved} icon={CheckCircle} color="primary" />
            </div>

            <div className="stat-card">
              <h3 className="text-sm font-semibold mb-4">Priority Score: Before vs After</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" name="Before" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" name="After Fast Track" fill="hsl(152,60%,42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
