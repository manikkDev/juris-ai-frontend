import { Badge } from "@/components/ui/badge";

export function RiskBadge({ risk }: { risk: number }) {
  if (risk >= 0.7) return <Badge variant="destructive">{(risk * 100).toFixed(0)}% High</Badge>;
  if (risk >= 0.4) return <Badge className="bg-warning text-warning-foreground">{(risk * 100).toFixed(0)}% Medium</Badge>;
  return <Badge className="bg-success text-success-foreground">{(risk * 100).toFixed(0)}% Low</Badge>;
}
