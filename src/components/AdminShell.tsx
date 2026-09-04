import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Clock,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
Settings,
  SquareCheckBig,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import logoAsset from "@/assets/attend360-logo.png.asset.json";
import markAsset from "@/assets/attend360-mark.png.asset.json";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/corrections", label: "Corrections", icon: SquareCheckBig },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {nav.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4" />
            {t(item.label)}
          </Link>
        );
      })}
      <Separator className="my-3" />
      <Link
        to="/profile"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      >
        <User className="size-4" />
        {t("My Profile")}
      </Link>
      <Link
        to="/login"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger"
      >
        <LogOut className="size-4" />
        {t("Logout")}
      </Link>
    </nav>
  );
}

function Brand() {
  const { t } = useI18n();
  return (
    <div className="px-5 py-5">
      <img
        src={logoAsset.url}
        alt="Attend360"
        className="hidden h-8 w-auto lg:block"
        width={200}
        height={60}
      />
      <div className="flex items-center gap-2.5 lg:hidden">
        <img src={markAsset.url} alt="Attend360" className="size-9 rounded-lg" />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Attend360</p>
          <p className="text-xs text-muted-foreground">{t("Attendance Suite")}</p>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <NavList />
        <div className="p-4">
          <div className="rounded-xl bg-primary-soft p-3 text-xs text-secondary-foreground">
            <p className="font-semibold">{t("248 employees")}</p>
            <p className="mt-1 text-muted-foreground">{t("3 locations · 4 shifts")}</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("Open menu")}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar p-0">
                <Brand />
                <NavList />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-tight">{t(title)}</h1>
              {description ? (
                <p className="truncate text-xs text-muted-foreground">{t(description)}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <LanguageSwitcher className="hidden sm:flex" />
              <Button asChild variant="ghost" size="icon" aria-label={t("Notifications")}>
                <Link to="/notifications" className="relative">
                  <Bell className="size-5" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
                </Link>
              </Button>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm hover:bg-accent"
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  HR
                </span>
                <span className="hidden sm:inline">{t("Admin")}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
