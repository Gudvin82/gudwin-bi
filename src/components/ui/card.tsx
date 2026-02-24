import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <section
      {...props}
      className={cn(
        "rounded-2xl border border-border/80 bg-card/95 p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-5",
        className
      )}
    >
      {children}
    </section>
  );
}
