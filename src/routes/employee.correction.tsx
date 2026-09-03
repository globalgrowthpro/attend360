import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { EmployeeShell } from "@/components/EmployeeShell";
import { RequestStatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/employee/correction")({
  head: () => ({
    meta: [
      { title: "Attendance Correction — TimeTrack" },
      {
        name: "description",
        content:
          "Request a correction for a missed or wrong check-in or check-out and follow the approval status.",
      },
      { property: "og:title", content: "Attendance Correction — TimeTrack" },
      { property: "og:description", content: "Fix a wrong attendance record in a few taps." },
    ],
  }),
  component: CorrectionPage,
});

const schema = z.object({
  date: z.string().trim().min(1, "Pick the date to correct"),
  time: z.string().trim().min(1, "Enter the requested time"),
  reason: z
    .string()
    .trim()
    .min(10, "Please give at least 10 characters of context")
    .max(500, "Keep the reason under 500 characters"),
});

const myRequests = [
  { date: "28 Aug 2026", field: "Check In", requested: "08:58 AM", status: "approved" as const },
  { date: "25 Aug 2026", field: "Check Out", requested: "05:10 PM", status: "rejected" as const },
];

function CorrectionPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    toast.success("Correction request submitted", { description: "HR has been notified." });
    navigate({ to: "/employee" });
  }

  return (
    <EmployeeShell title="Attendance correction">
      <div className="space-y-4">
        <div>
          <p className="text-xl font-semibold">Attendance Correction</p>
          <p className="text-sm text-muted-foreground">Ask HR to adjust a recorded time.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New request</CardTitle>
            <CardDescription>Current record — Check In: 09:32 AM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Date</Label>
                <Input type="date" name="date" defaultValue="2026-09-03" />
                {errors["date"] ? <p className="mt-1 text-xs text-danger">{errors["date"]}</p> : null}
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Field to correct</Label>
                <Select defaultValue="checkin">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkin">Check In</SelectItem>
                    <SelectItem value="checkout">Check Out</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Requested time</Label>
                <Input type="time" name="time" defaultValue="09:00" />
                {errors["time"] ? <p className="mt-1 text-xs text-danger">{errors["time"]}</p> : null}
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Reason</Label>
                <Textarea name="reason" rows={3} maxLength={500} placeholder="Forgot to check in." />
                {errors["reason"] ? <p className="mt-1 text-xs text-danger">{errors["reason"]}</p> : null}
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">My requests</CardTitle></CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">03 Sep 2026 · Check In</p>
                <p className="text-xs text-muted-foreground tabular">09:32 AM → 09:00 AM</p>
              </div>
              <RequestStatusBadge status="pending" />
            </div>
            {myRequests.map((r) => (
              <div key={r.date} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">
                    {r.date} · {r.field}
                  </p>
                  <p className="text-xs text-muted-foreground tabular">Requested {r.requested}</p>
                </div>
                <RequestStatusBadge status={r.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </EmployeeShell>
  );
}
