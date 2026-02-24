import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent", className)}>
      {children}
    </span>
  );
}
