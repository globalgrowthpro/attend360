import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardPlus,
  FilePlus2,
  Timer,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { activityFeed, attendanceTrend } from "@/lib/attendance-data";
import { useI18n } from "@/lib/i18n";
import { useCurrentDateTime } from "@/hooks/use-current-date-time";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Attend360 Attendance" },
      {
        name: "description",
        content:
          "Live attendance overview: present, late, absent and on-leave headcount, today's activity feed and quick actions.",
      },
      { property: "og:title", content: "Admin Dashboard — Attend360 Attendance" },
      {
        property: "og:description",
        content: "Monitor organization-wide attendance in real time with Attend360.",
      },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Total Employees", value: "248", tone: "bg-primary-soft text-primary", to: "/employees", status: undefined },
  { label: "Present", value: "213", tone: "bg-success-soft text-success", to: "/attendance", status: "present" },
  { label: "Absent", value: "18", tone: "bg-danger-soft text-danger", to: "/attendance", status: "absent" },
  { label: "Late", value: "12", tone: "bg-warning-soft text-warning", to: "/attendance", status: "late" },
  { label: "On Leave", value: "5", tone: "bg-info-soft text-info", to: "/attendance", status: "leave" },
  { label: "Working Now", value: "174", tone: "bg-violet-soft text-violet", to: "/attendance", status: undefined },
] as const;

const breakdown = [
  { label: "Present", pct: 86, cls: "bg-success" },
  { label: "Late", pct: 5, cls: "bg-warning" },
  { label: "Absent", pct: 7, cls: "bg-danger" },
  { label: "Leave", pct: 2, cls: "bg-info" },
];

const quickActions = [
  { label: "Add Employee", icon: UserPlus, to: "/employees/new" },
  { label: "Record Attendance", icon: CalendarClock, to: "/attendance" },
  { label: "Attendance Correction", icon: ClipboardPlus, to: "/corrections" },
  { label: "Generate Report", icon: FilePlus2, to: "/reports" },
] as const;

function Dashboard() {
  const { t } = useI18n();
  const { greeting, formatted } = useCurrentDateTime();
  return (
    <AdminShell
      title={greeting}
      description={formatted}
      actions={
        <div className="hidden items-center gap-2 md:flex">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Locations")}</SelectItem>
              <SelectItem value="cairo">{t("Cairo HQ")}</SelectItem>
              <SelectItem value="giza">{t("Giza Office")}</SelectItem>
              <SelectItem value="alex">{t("Alexandria Office")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t("Today")}</SelectItem>
              <SelectItem value="week">{t("This week")}</SelectItem>
              <SelectItem value="month">{t("This month")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.to} className="group">
            <Card className="h-full transition-shadow hover:shadow-pop">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-8 place-items-center rounded-lg ${kpi.tone}`}
                    aria-hidden
                  >
                    {kpi.label === "Working Now" ? (
                      <Timer className="size-4" />
                    ) : (
                      <Users className="size-4" />
                    )}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-3 text-2xl font-semibold tabular">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{t(kpi.label)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">{t("Today's Attendance")}</CardTitle>
            <span className="text-xs text-muted-foreground">{t("248 scheduled employees")}</span>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              {breakdown.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">{t(row.label)}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${row.cls}`} style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-10 text-end text-xs font-medium tabular">{row.pct}%</span>
                </div>
              ))}
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrend} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="present" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">{t("Today's Activity")}</CardTitle>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-success" /> {t("Live")}
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityFeed.map((item) => (
              <div
                key={item.name + item.time}
                className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{t(item.action)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.office}</p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-xs font-medium tabular">{item.time}</p>
                  <StatusBadge status={item.status} className="mt-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">{t("Quick Actions")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button key={action.label} asChild variant="outline" className="h-12 justify-start gap-3">
              <Link to={action.to}>
                <action.icon className="size-4 text-primary" />
                {t(action.label)}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
