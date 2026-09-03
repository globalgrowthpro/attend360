import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Mail, Phone, Pencil } from "lucide-react";

import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { attendanceRecords, employees, workSchedule } from "@/lib/attendance-data";

export const Route = createFileRoute("/employees/$id")({
  head: () => ({
    meta: [
      { title: "Employee Profile — Attend360 Attendance" },
      {
        name: "description",
        content:
          "Employee profile with attendance summary, schedule, leave balance, documents and activity log.",
      },
      { property: "og:title", content: "Employee Profile — Attend360 Attendance" },
      { property: "og:description", content: "Review an employee's attendance record and schedule." },
    ],
  }),
  component: EmployeeProfilePage,
  notFoundComponent: () => (
    <AdminShell title="Employee not found">
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          This employee record doesn't exist.
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/employees">Back to employees</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  ),
});

const summary = [
  { label: "Present", value: "22", cls: "text-success" },
  { label: "Absent", value: "1", cls: "text-danger" },
  { label: "Late", value: "3", cls: "text-warning" },
  { label: "Early Leave", value: "2", cls: "text-violet" },
  { label: "Total Hours", value: "176h", cls: "text-foreground" },
  { label: "Overtime", value: "8h", cls: "text-primary" },
];

function EmployeeProfilePage() {
  const { id } = Route.useParams();
  const employee = employees.find((e) => e.id === id);
  if (!employee) throw notFound();

  const records = attendanceRecords.filter((r) => r.code === employee.code);

  return (
    <AdminShell
      title={employee.name}
      description={`${employee.code} · ${employee.department}`}
      actions={
        <Button size="sm" variant="outline">
          <Pencil className="size-4" /> Edit
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-xl font-semibold text-primary">
            {employee.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success">
                {employee.active ? "Active" : "Inactive"}
              </span>
              <StatusBadge status={employee.today} />
            </div>
            <p className="text-sm text-muted-foreground">
              {employee.code} · {employee.position}
            </p>
            <p className="text-sm text-muted-foreground">
              {employee.department} Department · {employee.location}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" /> {employee.email}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" /> {employee.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mt-4">
        <TabsList className="flex-wrap">
          {["overview", "attendance", "schedule", "leave", "documents", "activity"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Attendance Summary — September 2026</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {summary.map((s) => (
                <div key={s.label} className="rounded-xl border border-border p-3">
                  <p className={`text-xl font-semibold tabular ${s.cls}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Employment</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Manager", employee.manager],
                ["Employment Type", employee.type],
                ["Joining Date", employee.joined],
                ["Shift", employee.shift],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="text-sm font-medium">{v}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell className="tabular">{r.checkIn ?? "—"}</TableCell>
                      <TableCell className="tabular">{r.checkOut ?? "—"}</TableCell>
                      <TableCell className="tabular">{r.hours}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{r.device}</TableCell>
                    </TableRow>
                  ))}
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        No attendance records for this period.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{employee.shift}</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border">
              {workSchedule.map((d) => (
                <div key={d.day} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium">{d.day}</span>
                  <span className={d.weekend ? "text-muted-foreground" : "tabular"}>{d.hours}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <Card>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
              {[
                ["Annual leave", "12 / 21 days"],
                ["Sick leave", "2 / 10 days"],
                ["Unpaid leave", "0 days"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="mt-1 text-lg font-semibold">{v}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardContent className="divide-y divide-border p-4">
              {["National ID.pdf", "Employment contract.pdf", "Bank details.pdf"].map((doc) => (
                <div key={doc} className="flex items-center justify-between py-3 text-sm">
                  <span>{doc}</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="space-y-3 p-4 text-sm">
              {[
                ["03 Sep 08:55", "Checked in from PC-001 (Cairo HQ)"],
                ["02 Sep 17:04", "Checked out from PC-001"],
                ["28 Aug 10:02", "Correction request approved by Mona Adel"],
                ["12 Jan 2023", "Employee record created"],
              ].map(([time, text]) => (
                <div key={time} className="flex gap-3">
                  <span className="w-28 shrink-0 text-xs text-muted-foreground tabular">{time}</span>
                  <span>{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
