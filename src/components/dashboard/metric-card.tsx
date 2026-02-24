import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function MetricCard({ title, value, delta }: { title: string; value: string; delta: string }) {
  const bars = [38, 52, 40, 66, 58, 72, 64, 76, 70, 84];
  return (
    <Card className="group">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm text-muted">{title}</p>
        <div className="mini-bars w-20">
          {bars.map((bar, idx) => (
            <span key={`${title}-${idx}`} style={{ height: `${bar}%` }} />
          ))}
        </div>
      </div>
      <p className="premium-title mb-2 text-3xl font-extrabold">{value}</p>
      <Badge className="shadow-sm">{delta}</Badge>
    </Card>
  );
}
