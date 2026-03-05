import { useParams, useNavigate } from "react-router-dom";
import { useCases } from "@/hooks/useFirestoreData";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, FileText, Scale, Brain, User, Building, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, loading, error } = useCases();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm">Loading case details from Firestore...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3 max-w-md">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold">Failed to load case</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const caseData = cases.find((c) => c.caseId === id);

  if (!caseData) return <div className="text-center py-20 text-muted-foreground">Case not found</div>;

  const factors = [
    { name: "Number of adjournments", impact: caseData.adjournments > 5 ? "High" : caseData.adjournments > 2 ? "Medium" : "Low", value: caseData.adjournments },
    { name: "Case age (years)", impact: ((new Date().getTime() - new Date(caseData.filedDate).getTime()) / (365.25 * 86400000)) > 2 ? "High" : "Medium", value: ((new Date().getTime() - new Date(caseData.filedDate).getTime()) / (365.25 * 86400000)).toFixed(1) },
    { name: "Case category", impact: caseData.caseType.includes("Criminal") ? "High" : "Medium", value: caseData.category },
    { name: "Court workload", impact: "Medium", value: caseData.court },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">{caseData.caseNumber}</h1>
          <p className="text-sm text-muted-foreground">{caseData.caseType} · {caseData.court} · {caseData.bench}</p>
          <p className="text-xs text-muted-foreground mt-1">Source: {caseData.source}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Recommend Action</Button>
          <Button variant="outline" size="sm" className="text-destructive">Flag For Review</Button>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Petitioner</p>
            <p className="text-sm font-semibold">{caseData.petitioner}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <Building className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Respondent</p>
            <p className="text-sm font-semibold">{caseData.respondent}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="stat-card">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Case Description</p>
        <p className="text-sm">{caseData.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Judge", value: caseData.judge, icon: Scale },
          { label: "Filed Date", value: new Date(caseData.filedDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }), icon: Calendar },
          { label: "Last Hearing", value: new Date(caseData.lastHearingDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }), icon: Calendar },
          { label: "Adjournments", value: caseData.adjournments, icon: FileText },
        ].map((item) => (
          <div key={item.label} className="stat-card flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Predictions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">AI Analysis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Adjournment Probability</p>
            <div className="flex items-center gap-3">
              <Progress value={caseData.adjournmentRisk * 100} className="flex-1" />
              <RiskBadge risk={caseData.adjournmentRisk} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Delay Risk Score</p>
            <div className="flex items-center gap-3">
              <Progress value={caseData.delayProbability * 100} className="flex-1" />
              <span className="text-sm font-bold">{(caseData.delayProbability * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Predicted Resolution Time</p>
            <p className="text-lg font-display font-bold">{caseData.resolutionEstimate}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Top Factors Influencing Prediction</p>
          <div className="space-y-2">
            {factors.map((f) => (
              <div key={f.name} className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50 text-xs">
                <span>{f.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{f.value}</span>
                  <span className={`font-medium ${f.impact === "High" ? "text-destructive" : f.impact === "Medium" ? "text-warning" : "text-success"}`}>{f.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Hearing Timeline</h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
          {caseData.timeline.map((entry, i) => (
            <div key={i} className="relative mb-6 last:mb-0">
              <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-primary border-2 border-card" />
              <p className="text-xs text-muted-foreground">{entry.date}</p>
              <p className="text-sm font-semibold">{entry.event}</p>
              <p className="text-xs text-muted-foreground">{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
