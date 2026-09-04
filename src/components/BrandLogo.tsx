import { cn } from "@/lib/utils";

export function BrandLogo({
  variant = "light",
  className,
  size = "md",
  showSlogan = true,
}: {
  variant?: "light" | "dark";
  className?: string;
  size?: "sm" | "md" | "lg";
  showSlogan?: boolean;
}) {
  const isDark = variant === "dark";
  const imgSize = size === "lg" ? "size-11" : size === "sm" ? "size-7" : "size-9";
  const titleSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const sloganSize = size === "lg" ? "text-xs" : "text-[9px]";

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <img
        src="/icon-192.png"
        alt="Attend360 Logo"
        className={cn(imgSize, "rounded-xl object-contain shadow-xs shrink-0")}
      />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            titleSize,
            "font-extrabold tracking-tight",
            isDark ? "text-white" : "text-foreground",
          )}
        >
          Attend360
        </span>
        {showSlogan && (
          <span
            className={cn(
              sloganSize,
              "font-medium tracking-wider uppercase",
              isDark ? "text-white/70" : "text-muted-foreground",
            )}
          >
            Smart Attendance
          </span>
        )}
      </div>
    </div>
  );
}
