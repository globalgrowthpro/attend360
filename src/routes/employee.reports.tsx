import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmployeeShell } from "@/components/EmployeeShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/employee/reports")({
  head: () => ({
    meta: [
      { title: "My Reports — Attend360" },
      {
        name: "description",
        content:
          "Personal attendance report: present, late and absent days, total working hours, overtime and weekly hour trend.",
      },
      { property: "og:title", content: "My Reports — Attend360" },
      { property: "og:description", content: "Track your own hours, punctuality and overtime." },
    ],
  }),
  component: EmployeeReports,
});

const weekly = [
  { week: "W1", hours: 39 },
  { week: "W2", hours: 41 },
  { week: "W3", hours: 38 },
  { week: "W4", hours: 42 },
];

function EmployeeReports() {
  return (
    <EmployeeShell title="My reports">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold">My Reports</p>
            <p className="text-sm text-muted-foreground">Ahmed Ali · EMP001</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="2026-09">
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-09">September 2026</SelectItem>
                <SelectItem value="2026-08">August 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" aria-label="Export" onClick={() => toast.success("Export started")}>
              <Download className="size-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-5">
            {[
              ["Present Days", "21"],
              ["Absent Days", "1"],
              ["Late Days", "2"],
              ["Total Hours", "168h 30m"],
              ["Overtime", "7h 20m"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border p-3">
                <p className="text-lg font-semibold tabular">{v}</p>
                <p className="text-xs text-muted-foreground">{k}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Weekly hours</CardTitle></CardHeader>
          <CardContent className="h-56 p-4 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="hours" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </EmployeeShell>
  );
}
