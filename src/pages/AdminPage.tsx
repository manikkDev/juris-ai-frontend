import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sampleCases } from "@/services/mockData";
import { toast } from "sonner";
import { Plus, Upload, Users, FileText } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function AdminPage() {
  const [caseType, setCaseType] = useState("");
  const [court, setCourt] = useState("");
  const [judge, setJudge] = useState("");

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Case added: ${caseType} at ${court}`);
    setCaseType("");
    setCourt("");
    setJudge("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">System administration and case management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases" value={sampleCases.length} icon={FileText} color="primary" />
        <StatCard title="Judges" value={10} icon={Users} color="info" />
        <StatCard title="Courts" value={5} icon={FileText} color="success" />
        <StatCard title="System Uptime" value="99.9%" icon={FileText} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Add New Case</h3>
          </div>
          <form onSubmit={handleAddCase} className="space-y-3">
            <div><Label>Case Type</Label><Input value={caseType} onChange={(e) => setCaseType(e.target.value)} placeholder="e.g. Civil, Criminal" required /></div>
            <div><Label>Court</Label><Input value={court} onChange={(e) => setCourt(e.target.value)} placeholder="e.g. High Court Delhi" required /></div>
            <div><Label>Assigned Judge</Label><Input value={judge} onChange={(e) => setJudge(e.target.value)} placeholder="e.g. Hon. Justice Sharma" required /></div>
            <Button type="submit" className="w-full"><Plus className="h-4 w-4 mr-1" />Add Case</Button>
          </form>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Upload Dataset</h3>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop CSV or JSON file</p>
            <p className="text-xs text-muted-foreground mt-1">Supports bulk case import</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info("File upload coming soon")}>
              Select File
            </Button>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Recent System Logs</h3>
        <div className="space-y-2 text-xs">
          {[
            { time: "2 min ago", action: "Case JC-2024-0012 priority recalculated", user: "System" },
            { time: "15 min ago", action: "New case added by Clerk Rajan", user: "clerk@courts.gov.in" },
            { time: "1 hr ago", action: "AI predictions updated for 50 cases", user: "System" },
            { time: "3 hrs ago", action: "Judge Sharma profile updated", user: "admin@courts.gov.in" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
              <div>
                <span className="text-muted-foreground">{log.time}</span>
                <span className="ml-3">{log.action}</span>
              </div>
              <span className="text-muted-foreground">{log.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
