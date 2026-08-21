import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <span className="font-display text-[0.9em] font-semibold">F</span>
    </div>
  );
}
