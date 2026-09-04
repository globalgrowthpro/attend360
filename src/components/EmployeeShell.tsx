import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Clock, FileBarChart, Home, User } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAvatarUrl } from "@/lib/avatar-store";
import { useI18n } from "@/lib/i18n";
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
  const avatar = useAvatarUrl();
  const { t, dir } = useI18n();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0" dir={dir}>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/employee" className="flex items-center gap-2.5 hover:opacity-90">
            <BrandLogo mode="auto" className="h-7 w-auto" />
            <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary sm:inline-block">
              {t("Self service")}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/employee/profile"
              aria-label={t("My profile")}
              className="flex items-center gap-2 rounded-full border border-border p-1 pe-3 text-xs font-medium transition-colors hover:bg-accent"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Ahmed Ali"
                  className="size-7 rounded-full object-cover"
                />
              ) : (
                <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  AA
                </span>
              )}
              <span className="hidden sm:inline">Ahmed Ali</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-5 sm:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-3 shadow-card">
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
                    {t(item.label)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <h1 className="sr-only">{t(title)}</h1>
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
              {t(item.label)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
