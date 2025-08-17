import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
        <rect x="4" y="4" width="8" height="8" rx="2" fill="hsl(var(--background))" />
        <rect x="13" y="4" width="8" height="8" rx="2" fill="hsl(var(--background))" />
        <rect x="22" y="4" width="6" height="8" rx="2" fill="hsl(var(--background))" />
        <rect x="4" y="13" width="8" height="8" rx="2" fill="hsl(var(--background))" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="hsl(var(--accent))" />
        <rect x="4" y="22" width="8" height="6" rx="2" fill="hsl(var(--background))" />
        <rect x="13" y="22" width="8" height="6" rx="2" fill="hsl(var(--background))" />
        <rect x="22" y="13" width="6" height="15" rx="2" fill="hsl(var(--background))" />
      </svg>
       <span className="text-2xl md:text-3xl font-headline tracking-tighter font-bold text-foreground">
        Slide Sort
      </span>
    </div>
  );
}
