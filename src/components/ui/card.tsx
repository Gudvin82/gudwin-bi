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
        "card-premium rounded-2xl p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] sm:p-5",
        className
      )}
    >
      {children}
    </section>
  );
}
