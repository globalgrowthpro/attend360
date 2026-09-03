import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Clock, FileBarChart, Home, User } from "lucide-react";
import type { ReactNode } from "react";

import logoAsset from "@/assets/attend360-logo.png.asset.json";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/employee", label: "Home", icon: Home },
  { to: "/employee/attendance", label: "Attendance", icon: Clock },
  { to: "/employee/history", label: "History", icon: CalendarDays },
  { to: "/employee/reports", label: "Reports", icon: FileBarChart },
  { to: "/employee/profile", label: "Profile", icon: User },
] as const;

export function EmployeeShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-5 sm:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-3 shadow-card">
            <div className="px-2 py-3">
              <img src={logoAsset.url} alt="Attend360" className="h-7 w-auto" />
              <p className="mt-1 text-xs text-muted-foreground">Self service</p>
            </div>
            <nav className="mt-2 flex flex-col gap-1">
              {nav.map((item) => {
                const active =
                  item.to === "/employee" ? pathname === "/employee" : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              to="/"
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary-soft"
            >
              Switch to Admin Panel
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <h1 className="sr-only">{title}</h1>
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur md:hidden">
        {nav.map((item) => {
          const active =
            item.to === "/employee" ? pathname === "/employee" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
