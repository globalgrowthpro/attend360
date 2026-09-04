import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  mode = "auto",
  alt = "Attend360",
}: {
  className?: string;
  mode?: "auto" | "web" | "mobile";
  alt?: string;
}) {
  if (mode === "web") {
    return (
      <img
        src="/360-weblogo.png"
        alt={alt}
        className={cn("h-8 w-auto object-contain select-none", className)}
      />
    );
  }

  if (mode === "mobile") {
    return (
      <img
        src="/360-mobilelogo.png"
        alt={alt}
        className={cn("h-8 w-auto object-contain select-none", className)}
      />
    );
  }

  // mode === "auto": renders mobile logo on small screens, web logo on larger screens
  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      <img
        src="/360-mobilelogo.png"
        alt={alt}
        className="h-8 w-auto object-contain sm:hidden"
      />
      <img
        src="/360-weblogo.png"
        alt={alt}
        className="hidden h-8 w-auto object-contain sm:block"
      />
    </div>
  );
}
