import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileText, Printer, Table2 } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { absenceReport, lateReport } from "@/lib/attendance-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — TimeTrack Attendance" },
      {
        name: "description",
        content:
          "Attendance, late, absence and per-employee reports with date, department and location filters plus PDF, Excel and CSV export.",
      },
      { property: "og:title", content: "Reports — TimeTrack Attendance" },
      { property: "og:description", content: "Build and export attendance reports for any period." },
    ],
  }),
  component: ReportsPage,
});

const summary = [
  ["Total Employees", "248"],
  ["Present", "4,382"],
  ["Absent", "126"],
  ["Late", "214"],
  ["Total Working Hours", "34,821"],
  ["Overtime", "1,245"],
];

const exports = [
  { label: "PDF", icon: FileText },
  { label: "Excel", icon: FileSpreadsheet },
  { label: "CSV", icon: Table2 },
  { label: "Print", icon: Printer },
] as const;

function Filters() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Label className="mb-1.5 block text-xs text-muted-foreground">Date From</Label>
        <Input type="date" defaultValue="2026-09-01" />
      </div>
      <div>
        <Label className="mb-1.5 block text-xs text-muted-foreground">Date To</Label>
        <Input type="date" defaultValue="2026-09-30" />
      </div>
      {[
        ["Employee", ["All employees", "Ahmed Ali", "Sara Hassan"]],
        ["Department", ["All departments", "IT", "HR", "Finance"]],
        ["Location", ["All locations", "Cairo HQ", "Giza Office"]],
        ["Status", ["Any status", "Present", "Late", "Absent"]],
        ["Shift", ["All shifts", "Morning", "Evening", "Night"]],
      ].map(([label, options]) => (
        <div key={label as string}>
          <Label className="mb-1.5 block text-xs text-muted-foreground">{label as string}</Label>
          <Select defaultValue={(options as string[])[0] ?? ""}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(options as string[]).map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

function ReportsPage() {
  return (
    <AdminShell
      title="Reports"
      description="September 2026 · all locations"
      actions={
        <div className="flex gap-2">
          {exports.map((e) => (
            <Button
              key={e.label}
              size="sm"
              variant="outline"
              onClick={() => toast.success(`${e.label} export started`)}
            >
              <e.icon className="size-4" />
              <span className="hidden sm:inline">{e.label}</span>
            </Button>
          ))}
        </div>
      }
    >
      <Tabs defaultValue="attendance">
        <TabsList className="flex-wrap">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="late">Late</TabsTrigger>
          <TabsTrigger value="absence">Absence</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Filters</CardTitle></CardHeader>
            <CardContent><Filters /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {summary.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border p-3">
                  <p className="text-xl font-semibold tabular">{v}</p>
                  <p className="text-xs text-muted-foreground">{k}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ahmed Ali — September 2026</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
        </TabsContent>

        <TabsContent value="late" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Late By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lateReport.map((r) => (
                    <TableRow key={r.employee + r.date}>
                      <TableCell className="font-medium">{r.employee}</TableCell>
                      <TableCell className="text-muted-foreground">{r.date}</TableCell>
                      <TableCell className="tabular">{r.scheduled}</TableCell>
                      <TableCell className="tabular">{r.actual}</TableCell>
                      <TableCell className="tabular font-medium text-warning">{r.lateBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absence" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absenceReport.map((r) => (
                    <TableRow key={r.employee + r.date}>
                      <TableCell className="font-medium">{r.employee}</TableCell>
                      <TableCell className="text-muted-foreground">{r.date}</TableCell>
                      <TableCell>{r.department}</TableCell>
                      <TableCell>{r.shift}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            r.approved ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                          }`}
                        >
                          {r.approved ? "Approved" : "Unapproved"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
