import { useState } from "react";
import { useCases } from "@/hooks/useFirestoreData";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, AlertTriangle } from "lucide-react";

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const { cases, loading, error } = useCases();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm">Loading cases from Firestore...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3 max-w-md">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold">Failed to load cases</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const filtered = cases.filter((c) => {
    const matchesSearch = c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.caseType.toLowerCase().includes(search.toLowerCase()) ||
      c.judge.toLowerCase().includes(search.toLowerCase()) ||
      c.court.toLowerCase().includes(search.toLowerCase()) ||
      c.petitioner.toLowerCase().includes(search.toLowerCase()) ||
      c.respondent.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-display font-bold">Cases</h1>
        <p className="text-sm text-muted-foreground">Real Indian High Court cases — eCourts / AWS Open Data (2020-2024)</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Resolved"].map((s) => (
            <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Case Number</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 pr-4 font-medium">Court</th>
              <th className="pb-2 pr-4 font-medium">Judge</th>
              <th className="pb-2 pr-4 font-medium">Filed</th>
              <th className="pb-2 pr-4 font-medium">Adj. Risk</th>
              <th className="pb-2 pr-4 font-medium">Priority</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.caseId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 pr-4 font-mono text-xs">{c.caseNumber}</td>
                <td className="py-2.5 pr-4 text-xs">{c.caseType}</td>
                <td className="py-2.5 pr-4 text-xs">{c.court}</td>
                <td className="py-2.5 pr-4 text-xs">{c.judge}</td>
                <td className="py-2.5 pr-4 text-xs">{new Date(c.filedDate).toLocaleDateString("en-IN")}</td>
                <td className="py-2.5 pr-4"><RiskBadge risk={c.adjournmentRisk} /></td>
                <td className="py-2.5 pr-4 font-bold">{c.priorityScore}</td>
                <td className="py-2.5 pr-4 text-xs">{c.status}</td>
                <td className="py-2.5 space-x-1">
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => navigate(`/cases/${c.caseId}`)}>View</Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">Flag</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No cases found</p>}
      </div>
    </div>
  );
}
