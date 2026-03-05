import { sampleCases, analyticsData } from "@/services/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { Brain, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";

export default function InsightsPage() {
  const highRiskCases = sampleCases.filter((c) => c.adjournmentRisk > 0.7);
  const avgRisk = (sampleCases.reduce((a, b) => a + b.adjournmentRisk, 0) / sampleCases.length * 100).toFixed(1);
  const avgDelay = (sampleCases.reduce((a, b) => a + b.delayProbability, 0) / sampleCases.length * 100).toFixed(1);

  const riskDistribution = [
    { range: "0-20%", count: sampleCases.filter((c) => c.adjournmentRisk < 0.2).length },
    { range: "20-40%", count: sampleCases.filter((c) => c.adjournmentRisk >= 0.2 && c.adjournmentRisk < 0.4).length },
    { range: "40-60%", count: sampleCases.filter((c) => c.adjournmentRisk >= 0.4 && c.adjournmentRisk < 0.6).length },
    { range: "60-80%", count: sampleCases.filter((c) => c.adjournmentRisk >= 0.6 && c.adjournmentRisk < 0.8).length },
    { range: "80-100%", count: sampleCases.filter((c) => c.adjournmentRisk >= 0.8).length },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold">AI Insights</h1>
        <p className="text-sm text-muted-foreground">Machine learning predictions and risk analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Adj. Risk" value={`${avgRisk}%`} icon={Brain} color="primary" />
        <StatCard title="Avg Delay Risk" value={`${avgDelay}%`} icon={Clock} color="info" />
        <StatCard title="High Risk Cases" value={highRiskCases.length} icon={AlertTriangle} color="destructive" />
        <StatCard title="Prediction Accuracy" value="87.3%" icon={TrendingUp} color="success" trend="Based on validation set" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(215,80%,28%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">High Risk Cases</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {highRiskCases.slice(0, 10).map((c) => (
              <div key={c.caseId} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-xs">
                <div>
                  <span className="font-mono font-medium">{c.caseId}</span>
                  <span className="text-muted-foreground ml-2">{c.caseType}</span>
                </div>
                <RiskBadge risk={c.adjournmentRisk} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
