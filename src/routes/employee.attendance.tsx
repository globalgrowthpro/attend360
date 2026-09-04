import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardPlus } from "lucide-react";

import { EmployeeShell } from "@/components/EmployeeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/employee/attendance")({
  head: () => ({
    meta: [
      { title: "My Attendance — Attend360" },
      {
        name: "description",
        content:
          "Today's attendance detail: schedule, check-in and check-out times, working hours, device, location and status.",
      },
      { property: "og:title", content: "My Attendance — Attend360" },
      { property: "og:description", content: "See exactly how today's attendance was recorded." },
    ],
  }),
  component: EmployeeAttendance,
});

const rows = [
  ["Scheduled", "09:00 AM – 05:00 PM"],
  ["Check In", "08:56 AM"],
  ["Check Out", "—"],
  ["Working Hours", "04h 25m"],
  ["Break", "60 min"],
  ["Overtime", "0h"],
  ["Location", "Cairo HQ"],
  ["Device", "PC-001"],
  ["Source", "Web"],
];

const recent = [
  { date: "02 Sep 2026", inAt: "08:51 AM", outAt: "05:04 PM", hours: "8h 13m", status: "present" as const },
  { date: "01 Sep 2026", inAt: "09:11 AM", outAt: "05:02 PM", hours: "7h 51m", status: "late" as const },
  { date: "31 Aug 2026", inAt: "08:47 AM", outAt: "03:30 PM", hours: "6h 43m", status: "early-leave" as const },
  { date: "30 Aug 2026", inAt: "—", outAt: "—", hours: "—", status: "leave" as const },
];

function EmployeeAttendance() {
  return (
    <EmployeeShell title="My attendance">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold">Today's Attendance</p>
            <p className="text-sm text-muted-foreground">Thursday, 03 September 2026</p>
          </div>
          <StatusBadge status="present" />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Record detail</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border p-4 pt-0">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium tabular">{v}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <Button asChild variant="outline" className="w-full">
              <Link to="/employee/correction">
                <ClipboardPlus className="size-4" /> Request correction
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent days</CardTitle></CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {recent.map((r) => (
              <div key={r.date} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{r.date}</p>
                  <p className="text-xs text-muted-foreground tabular">
                    {r.inAt} → {r.outAt}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium tabular">{r.hours}</p>
                  <StatusBadge status={r.status} className="mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </EmployeeShell>
  );
}
