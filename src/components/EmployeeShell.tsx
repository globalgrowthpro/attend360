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
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <BrandLogo mode="mobile" className="h-7 w-auto" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/employee/profile" aria-label={t("My profile")}>
            {avatar ? (
              <img
                src={avatar}
                alt="Ahmed Ali"
                className="size-9 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                AA
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-5 sm:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-3 shadow-card">
            <div className="px-2 py-3">
              <BrandLogo mode="web" className="h-7 w-auto" />
              <LanguageSwitcher className="mt-3 w-fit" />
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
