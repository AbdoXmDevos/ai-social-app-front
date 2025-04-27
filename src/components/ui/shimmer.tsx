import { cn } from "@/lib/utils";

export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-transparent via-secondary/20 to-transparent bg-[length:200%_100%]",
        className
      )}
    />
  );
} 