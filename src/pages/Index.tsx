import { Briefcase, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { sampleCases, analyticsData } from "@/services/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(215,80%,28%)", "hsl(200,75%,45%)", "hsl(152,60%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(270,60%,50%)", "hsl(180,60%,40%)", "hsl(320,60%,50%)"];

export default function DashboardPage() {
  const navigate = useNavigate();
  const totalCases = sampleCases.length;
  const activeCases = sampleCases.filter((c) => c.status === "Active").length;
  const delayedCases = sampleCases.filter((c) => c.adjournmentRisk > 0.6).length;
  const highPriority = sampleCases.filter((c) => c.priorityScore > 70).length;

  const topCases = [...sampleCases].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 10);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Judicial case intelligence overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases" value={totalCases} icon={Briefcase} color="primary" trend="+12% from last month" />
        <StatCard title="Active Cases" value={activeCases} icon={Clock} color="info" trend="Requires attention" />
        <StatCard title="Delayed Cases" value={delayedCases} icon={AlertTriangle} color="destructive" trend="High adj. risk" />
        <StatCard title="High Priority" value={highPriority} icon={TrendingUp} color="warning" trend="AI prioritized" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Case Backlog Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.backlogOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="hsl(215,80%,28%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="resolved" stroke="hsl(152,60%,42%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Adjournment Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.adjournmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="adjournments" fill="hsl(200,75%,45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Case Types Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analyticsData.caseTypeDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {analyticsData.caseTypeDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Monthly Case Resolution Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData.monthlyResolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="resolved" stroke="hsl(152,60%,42%)" fill="hsl(152,60%,42%,0.15)" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="hsl(0,72%,51%)" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Table */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">AI Prioritized Cases</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Case ID</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Judge</th>
                <th className="pb-2 pr-4 font-medium">Filed</th>
                <th className="pb-2 pr-4 font-medium">Last Hearing</th>
                <th className="pb-2 pr-4 font-medium">Adj. Risk</th>
                <th className="pb-2 pr-4 font-medium">Priority</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {topCases.map((c) => (
                <tr key={c.caseId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs">{c.caseId}</td>
                  <td className="py-2.5 pr-4">{c.caseType}</td>
                  <td className="py-2.5 pr-4 text-xs">{c.judge}</td>
                  <td className="py-2.5 pr-4 text-xs">{c.filedDate}</td>
                  <td className="py-2.5 pr-4 text-xs">{c.lastHearingDate}</td>
                  <td className="py-2.5 pr-4"><RiskBadge risk={c.adjournmentRisk} /></td>
                  <td className="py-2.5 pr-4 font-bold">{c.priorityScore}</td>
                  <td className="py-2.5 pr-4 text-xs">{c.status}</td>
                  <td className="py-2.5">
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => navigate(`/cases/${c.caseId}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
