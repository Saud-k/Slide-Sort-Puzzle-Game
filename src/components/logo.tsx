import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <Image 
        src="/logo.svg" 
        alt="Slide Sort Logo" 
        width={32} 
        height={32} 
        className="h-8 w-8"
        aria-hidden="true"
      />
       <span className="text-2xl md:text-3xl font-headline tracking-tighter font-bold text-foreground">
        Slide Sort
      </span>
    </div>
  );
}
