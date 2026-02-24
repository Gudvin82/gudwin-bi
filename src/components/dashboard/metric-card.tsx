import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function MetricCard({ title, value, delta }: { title: string; value: string; delta: string }) {
  return (
    <Card>
      <p className="mb-2 text-sm text-muted">{title}</p>
      <p className="mb-2 text-3xl font-extrabold">{value}</p>
      <Badge>{delta}</Badge>
    </Card>
  );
}
