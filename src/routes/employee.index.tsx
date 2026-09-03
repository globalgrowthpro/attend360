import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardPlus, MapPin, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmployeeShell } from "@/components/EmployeeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/employee/")({
  head: () => ({
    meta: [
      { title: "Check In / Check Out — Attend360" },
      {
        name: "description",
        content:
          "Employee home: current time, today's schedule, one-tap check in and check out, and live working hours.",
      },
      { property: "og:title", content: "Check In / Check Out — Attend360" },
      { property: "og:description", content: "Start and end your workday in one tap." },
    ],
  }),
  component: EmployeeHome,
});

type Phase = "idle" | "working" | "done";

function EmployeeHome() {
  const [phase, setPhase] = useState<Phase>("working");
  const [clock, setClock] = useState("08:56 AM");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, []);

  return (
    <EmployeeShell title="Employee home">
      <div className="space-y-4">
        <div>
          <p className="text-xl font-semibold">Good Morning, Ahmed 👋</p>
          <p className="text-sm text-muted-foreground">Thursday, 03 September 2026</p>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-primary px-5 py-6 text-center text-primary-foreground">
            <p className="text-xs uppercase tracking-wide opacity-80">Current time</p>
            <p className="mt-1 text-4xl font-semibold tabular">{clock}</p>
            <p className="mt-1 text-xs opacity-80">Cairo HQ · Device PC-001 approved</p>
          </div>
          <CardContent className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground">Scheduled</p>
                <p className="mt-0.5 text-sm font-medium tabular">09:00 – 17:00</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground">Check In</p>
                <p className="mt-0.5 text-sm font-medium tabular">
                  {phase === "idle" ? "—" : "08:56 AM"}
                </p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground">
                  {phase === "done" ? "Check Out" : "Working"}
                </p>
                <p className="mt-0.5 text-sm font-medium tabular">
                  {phase === "idle" ? "—" : phase === "working" ? "04h 25m" : "05:05 PM"}
                </p>
              </div>
            </div>

            {phase === "done" ? (
              <div className="rounded-xl bg-success-soft p-4 text-center">
                <p className="text-sm font-semibold text-success">✓ Attendance Completed</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Check In</span><span className="tabular">08:56 AM</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Check Out</span><span className="tabular">05:05 PM</span></div>
                  <div className="flex justify-between font-medium"><span>Total</span><span className="tabular">08h 09m</span></div>
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="h-14 w-full text-base"
                variant={phase === "working" ? "outline" : "default"}
                onClick={() => {
                  if (phase === "idle") {
                    setPhase("working");
                    toast.success("Checked in at 08:56 AM", { description: "Status: Present" });
                  } else {
                    setPhase("done");
                    toast.success("Checked out at 05:05 PM", { description: "Total 08h 09m" });
                  }
                }}
              >
                {phase === "idle" ? "CHECK IN" : "CHECK OUT"}
              </Button>
            )}

            <div className="flex items-center justify-center gap-2">
              <StatusBadge status={phase === "idle" ? "absent" : "present"} />
              <span className="text-xs text-muted-foreground">Grace period 10 min</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Validation checks</CardTitle></CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            {[
              [Smartphone, "Device PC-001", "Approved"],
              [MapPin, "Location Cairo HQ", "Inside geofence"],
              [CalendarDays, "Morning Shift", "Working day"],
            ].map(([Icon, label, value]) => {
              const I = Icon as typeof Smartphone;
              return (
                <div key={label as string} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <I className="size-4" /> {label as string}
                  </span>
                  <span className="font-medium text-success">{value as string}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Something wrong with a record?</p>
                <p className="text-xs text-muted-foreground">Send a correction request to HR.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/employee/correction">
                  <ClipboardPlus className="size-4" /> Request
                </Link>
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-4 gap-2 text-center">
              {[["Present", "19"], ["Late", "2"], ["Absent", "1"], ["Leave", "1"]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-lg font-semibold tabular">{v}</p>
                  <p className="text-xs text-muted-foreground">{k}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeShell>
  );
}
