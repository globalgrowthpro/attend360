import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Clock,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  SquareCheckBig,
  User,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";

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

function NavList({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();

  return (
    <nav className={cn("flex flex-1 flex-col gap-1", collapsed ? "px-2" : "px-3")}>
      {nav.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? t(item.label) : undefined}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && <span className="truncate">{t(item.label)}</span>}
          </Link>
        );
      })}
      <Separator className={cn("my-2.5", collapsed && "mx-1")} />
      <Link
        to="/profile"
        onClick={onNavigate}
        title={collapsed ? t("My Profile") : undefined}
        className={cn(
          "flex items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
          collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
        )}
      >
        <User className="size-4 shrink-0" />
        {!collapsed && <span className="truncate">{t("My Profile")}</span>}
      </Link>
    </nav>
  );
}

function LogoutButton({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  return (
    <Button
      asChild
      variant="outline"
      title={collapsed ? t("Logout") : undefined}
      className={cn(
        "rounded-xl border-border/80 bg-sidebar-accent/30 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
        collapsed
          ? "size-10 p-0 mx-auto flex items-center justify-center"
          : "w-full justify-start gap-3 px-3 py-2.5",
      )}
      onClick={onNavigate}
    >
      <Link to="/login">
        <LogOut className="size-4 shrink-0" />
        {!collapsed && <span>{t("Logout")}</span>}
      </Link>
    </Button>
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
  const { t, dir } = useI18n();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("attend360.sidebar.collapsed") === "true";
    }
    return false;
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("attend360.sidebar.collapsed", String(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Desktop Collapsible Sidebar (w-64 expanded, w-16 collapsed) */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-30 hidden flex-col border-e border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out lg:flex overflow-hidden",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Sidebar Header with Logos & Toggle Button */}
        <div
          className={cn(
            "flex items-center border-b border-sidebar-border/60 py-3.5 transition-all",
            collapsed
              ? "flex-col gap-2 px-2 justify-center"
              : "justify-between gap-3 px-4",
          )}
        >
          <Link
            to="/"
            className="flex min-w-0 items-center transition-transform hover:opacity-90"
            title="Attend360"
          >
            {collapsed ? (
              <img
                src="/apple-touch-icon.png"
                alt="Attend360"
                className="size-9 rounded-xl object-contain shadow-xs shrink-0"
              />
            ) : (
              <img
                src="/360-weblogo.png"
                alt="Attend360"
                className="h-10 sm:h-11 w-auto max-w-[150px] object-contain shrink-0"
              />
            )}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            title={collapsed ? t("Expand sidebar") : t("Collapse sidebar")}
            aria-label={collapsed ? t("Expand sidebar") : t("Collapse sidebar")}
          >
            {collapsed ? (
              dir === "rtl" ? (
                <PanelRightOpen className="size-4" />
              ) : (
                <PanelLeftOpen className="size-4" />
              )
            ) : dir === "rtl" ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <NavList collapsed={collapsed} />
        </div>

        {/* Bottom Logout Area */}
        <div className={cn("border-t border-sidebar-border/60", collapsed ? "p-2 text-center" : "p-3")}>
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>

      {/* Main Content Area (tracks sidebar width) */}
      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out",
          collapsed ? "lg:ps-16" : "lg:ps-64",
        )}
      >
        <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            {/* Mobile Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("Open menu")}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={dir === "rtl" ? "right" : "left"}
                className="flex w-60 flex-col justify-between bg-sidebar p-0"
              >
                <div className="flex flex-1 flex-col overflow-y-auto">
                  <div className="border-b border-sidebar-border/60 px-5 py-4">
                    <img
                      src="/360-weblogo.png"
                      alt="Attend360"
                      className="h-11 sm:h-12 w-auto max-w-[185px] object-contain"
                    />
                  </div>
                  <div className="py-3">
                    <NavList />
                  </div>
                </div>
                <div className="border-t border-sidebar-border/60 p-3">
                  <LogoutButton />
                </div>
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
                  <span className="absolute end-2 top-2 size-2 rounded-full bg-danger" />
                </Link>
              </Button>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-border py-1 ps-1 pe-3 text-sm hover:bg-accent"
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
