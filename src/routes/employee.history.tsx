import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EmployeeShell } from "@/components/EmployeeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { septemberDays, type AttendanceStatus } from "@/lib/attendance-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/employee/history")({
  head: () => ({
    meta: [
      { title: "Attendance History — TimeTrack" },
      {
        name: "description",
        content:
          "Monthly attendance calendar with colour-coded present, late, absent, leave and weekend days plus daily detail.",
      },
      { property: "og:title", content: "Attendance History — TimeTrack" },
      { property: "og:description", content: "Browse your attendance month by month." },
    ],
  }),
  component: HistoryPage,
});

const dayCls: Record<string, string> = {
  present: "bg-success-soft text-success",
  late: "bg-warning-soft text-warning",
  absent: "bg-danger-soft text-danger",
  leave: "bg-info-soft text-info",
  weekend: "bg-muted text-muted-foreground",
  future: "bg-card text-muted-foreground/60",
};

const legend = [
  ["Present", "bg-success"],
  ["Late", "bg-warning"],
  ["Absent", "bg-danger"],
  ["Leave", "bg-info"],
  ["Weekend", "bg-muted-foreground/40"],
];

function HistoryPage() {
  const [day, setDay] = useState<(typeof septemberDays)[number] | null>(null);

  return (
    <EmployeeShell title="Attendance history">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-semibold">Attendance History</p>
          <Select defaultValue="2026-09">
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-09">September 2026</SelectItem>
              <SelectItem value="2026-08">August 2026</SelectItem>
              <SelectItem value="2026-07">July 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="grid grid-cols-4 gap-3 p-4 text-center">
            {[["Present", "19"], ["Late", "2"], ["Absent", "1"], ["Leave", "1"]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border p-3">
                <p className="text-lg font-semibold tabular">{v}</p>
                <p className="text-xs text-muted-foreground">{k}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">September 2026</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-1 font-medium">{d}</div>
              ))}
              {/* 1 Sep 2026 is a Tuesday → two leading blanks */}
              <div /> <div />
              {septemberDays.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setDay(d)}
                  className={cn(
                    "aspect-square rounded-lg border border-border text-sm font-medium transition-shadow hover:shadow-card",
                    dayCls[d.status],
                  )}
                >
                  {d.day}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {legend.map(([label, cls]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-full", cls)} /> {label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!day} onOpenChange={(o) => !o && setDay(null)}>
        <DialogContent className="sm:max-w-sm">
          {day ? (
            <>
              <DialogHeader>
                <DialogTitle>{day.day} September 2026</DialogTitle>
                <DialogDescription>
                  {day.status === "weekend"
                    ? "Weekend — no shift scheduled."
                    : day.status === "future"
                      ? "Upcoming working day."
                      : "Recorded attendance for this day."}
                </DialogDescription>
              </DialogHeader>
              {day.status !== "weekend" && day.status !== "future" ? (
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={day.status as AttendanceStatus} />
                  </div>
                  {[
                    ["Scheduled", "09:00 AM – 05:00 PM"],
                    ["Check In", day.status === "late" ? "09:11 AM" : "08:56 AM"],
                    ["Check Out", "05:05 PM"],
                    ["Total", day.status === "late" ? "07h 54m" : "08h 09m"],
                    ["Location", "Cairo HQ"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium tabular">{v}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </EmployeeShell>
  );
}
