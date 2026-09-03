import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { attendanceRecords, statusMeta, type AttendanceRecord } from "@/lib/attendance-data";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Attend360" },
      {
        name: "description",
        content:
          "Daily attendance log with check-in, check-out, working hours, status badges, location and device for every employee.",
      },
      { property: "og:title", content: "Attendance — Attend360" },
      { property: "og:description", content: "Review and correct daily attendance records." },
    ],
  }),
  component: AttendancePage,
});

const counts = [
  { label: "Present", value: 213, cls: "bg-success-soft text-success" },
  { label: "Late", value: 12, cls: "bg-warning-soft text-warning" },
  { label: "Absent", value: 18, cls: "bg-danger-soft text-danger" },
  { label: "On Leave", value: 5, cls: "bg-info-soft text-info" },
  { label: "Early Leave", value: 4, cls: "bg-violet-soft text-violet" },
  { label: "Missing Check-out", value: 3, cls: "bg-secondary text-secondary-foreground" },
];

function AttendancePage() {
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);

  return (
    <AdminShell
      title="Attendance"
      description="Thursday, September 3, 2026 · 248 scheduled"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Export queued")}>
            <Download className="size-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Filter className="size-4" /> Filters
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {counts.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${c.cls}`}>
                {c.label}
              </span>
              <p className="mt-2 text-2xl font-semibold tabular">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Attendance Log</CardTitle>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select defaultValue="today">
              <SelectTrigger className="w-full sm:w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This week</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-loc">
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-loc">All Locations</SelectItem>
                <SelectItem value="cairo">Cairo HQ</SelectItem>
                <SelectItem value="giza">Giza Office</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-dep">
              <SelectTrigger className="w-full sm:w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-dep">All Departments</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((r) => (
                <TableRow
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(r)}
                >
                  <TableCell>
                    <p className="font-medium">{r.employee}</p>
                    <p className="text-xs text-muted-foreground tabular">{r.code}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="tabular">{r.checkIn ?? "—"}</TableCell>
                  <TableCell className="tabular">{r.checkOut ?? "—"}</TableCell>
                  <TableCell className="tabular">{r.hours}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell className="text-muted-foreground">{r.device}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Status legend</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(Object.keys(statusMeta) as Array<keyof typeof statusMeta>).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>Attendance Details</SheetTitle>
                <SheetDescription>
                  {selected.employee} · {selected.date}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Check In", selected.checkIn ?? "—"],
                    ["Check Out", selected.checkOut ?? "—"],
                    ["Working Hours", selected.hours],
                    ["Scheduled", selected.scheduled],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-border p-3">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="mt-0.5 text-sm font-medium tabular">{v}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd><StatusBadge status={selected.status} /></dd>
                  </div>
                  {[
                    ["Location", selected.location],
                    ["Device", selected.device],
                    ["IP Address", "••••••••"],
                    ["Source", selected.source],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Separator />
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Admin note</p>
                  <Textarea rows={3} maxLength={500} placeholder="Add a note to this record..." />
                </div>
                <div className="grid grid-cols-2 gap-2 pb-6">
                  <Button onClick={() => toast.success("Record approved")}>Approve</Button>
                  <Button variant="outline" onClick={() => toast.error("Record rejected")}>
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Edit mode enabled")}>
                    Edit Attendance
                  </Button>
                  <Button variant="ghost" onClick={() => toast.info("Activity log opened")}>
                    Activity Log
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
