import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Mail, Phone, Pencil } from "lucide-react";

import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useI18n } from "@/lib/i18n";

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
  notFoundComponent: () => {
    return <NotFoundEmployee />;
  },
});

function NotFoundEmployee() {
  const { t } = useI18n();
  return (
    <AdminShell title={t("Employee not found")}>
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          {t("This employee record doesn't exist.")}
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/employees">{t("Back to employees")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

function EmployeeProfilePage() {
  const { t } = useI18n();
  const { id } = Route.useParams();
  const employee = employees.find((e) => e.id === id);
  if (!employee) throw notFound();

  const records = attendanceRecords.filter((r) => r.code === employee.code);

  const summary = [
    { label: t("Present"), value: "22", cls: "text-success" },
    { label: t("Absent"), value: "1", cls: "text-danger" },
    { label: t("Late"), value: "3", cls: "text-warning" },
    { label: t("Early Leave"), value: "2", cls: "text-violet" },
    { label: t("Total Hours"), value: "176h", cls: "text-foreground" },
    { label: t("Overtime"), value: "8h", cls: "text-primary" },
  ];

  return (
    <AdminShell
      title={employee.name}
      description={`${employee.code} · ${t(employee.department)}`}
      actions={
        <Button size="sm" variant="outline">
          <Pencil className="size-4" /> {t("Edit")}
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <Avatar className="size-16 shrink-0 rounded-2xl ring-2 ring-primary/20 shadow-md">
            <AvatarImage src={employee.avatar} alt={employee.name} className="object-cover rounded-2xl" />
            <AvatarFallback className="rounded-2xl bg-primary-soft text-xl font-semibold text-primary">
              {employee.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success">
                {employee.active ? t("Active") : t("Inactive")}
              </span>
              <StatusBadge status={employee.today} />
            </div>
            <p className="text-sm text-muted-foreground">
              <span dir="ltr">{employee.code}</span> · {employee.position}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(employee.department)} · {t(employee.location)}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 shrink-0" /> <span dir="ltr">{employee.email}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4 shrink-0" /> <span dir="ltr">{employee.phone}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mt-4">
        <TabsList className="flex-wrap">
          {(
            [
              ["overview", "Overview"],
              ["attendance", "Attendance"],
              ["schedule", "Work Schedule"],
              ["leave", "Leave"],
              ["documents", "Documents"],
              ["activity", "Activity"],
            ] as const
          ).map(([val, label]) => (
            <TabsTrigger key={val} value={val} className="capitalize">
              {t(label)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{t("Attendance Summary — September 2026")}</CardTitle></CardHeader>
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
            <CardHeader><CardTitle className="text-base">{t("Employment")}</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [t("Manager"), employee.manager],
                [t("Employment Type"), t(employee.type)],
                [t("Joining Date"), <span key="jd" dir="ltr">{employee.joined}</span>],
                [t("Shift"), t(employee.shift)],
                [
                  t("National ID / Passport Number"),
                  <span key="nid" dir="ltr" className="font-mono">
                    {employee.nationalId ?? "29408150102345"}
                  </span>,
                ],
                [
                  t("Expiry Date"),
                  <span key="nide" dir="ltr">
                    {employee.nationalIdExpiry ?? "14 Aug 2031"}
                  </span>,
                ],
              ].map(([k, v], idx) => (
                <div key={idx}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <div className="text-sm font-medium mt-0.5">{v}</div>
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
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Check In")}</TableHead>
                    <TableHead>{t("Check Out")}</TableHead>
                    <TableHead>{t("Hours")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Device")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap"><span dir="ltr">{r.date}</span></TableCell>
                      <TableCell className="tabular"><span dir="ltr">{r.checkIn ?? "—"}</span></TableCell>
                      <TableCell className="tabular"><span dir="ltr">{r.checkOut ?? "—"}</span></TableCell>
                      <TableCell className="tabular"><span dir="ltr">{r.hours}</span></TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{r.device}</TableCell>
                    </TableRow>
                  ))}
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        {t("No attendance records for this period.")}
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
            <CardHeader><CardTitle className="text-base">{t(employee.shift)}</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border">
              {workSchedule.map((d) => (
                <div key={d.day} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium">{t(d.day)}</span>
                  <span className={d.weekend ? "text-muted-foreground" : "tabular"}>
                    {d.weekend ? t("Weekend") : <span dir="ltr">{d.hours}</span>}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <Card>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
              {[
                [t("Annual leave"), t("12 / 21 days")],
                [t("Sick leave"), t("2 / 10 days")],
                [t("Unpaid leave"), t("0 days")],
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
                  <span>{t(doc)}</span>
                  <Button variant="ghost" size="sm">{t("Download")}</Button>
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
                ["28 Aug 10:02", "Correction request approved by Habiba Rahim"],
                ["12 Jan 2023", "Employee record created"],
              ].map(([time, text]) => (
                <div key={time} className="flex gap-3">
                  <span className="w-28 shrink-0 text-xs text-muted-foreground tabular"><span dir="ltr">{time}</span></span>
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
