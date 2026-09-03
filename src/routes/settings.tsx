import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  devices,
  locations,
  permissionMatrix,
  shifts,
  workSchedule,
} from "@/lib/attendance-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TimeTrack Attendance" },
      {
        name: "description",
        content:
          "Configure company details, attendance rules, work schedule, shifts, locations, devices and role permissions.",
      },
      { property: "og:title", content: "Settings — TimeTrack Attendance" },
      { property: "og:description", content: "Tune attendance rules, shifts, devices and permissions." },
    ],
  }),
  component: SettingsPage,
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const deviceStatusCls: Record<string, string> = {
  Approved: "bg-success-soft text-success",
  Pending: "bg-warning-soft text-warning",
  Blocked: "bg-danger-soft text-danger",
  Expired: "bg-secondary text-muted-foreground",
};

function SettingsPage() {
  return (
    <AdminShell
      title="Settings"
      description="Company, attendance rules, shifts, devices and permissions"
      actions={
        <Button size="sm" onClick={() => toast.success("Settings saved")}>
          Save changes
        </Button>
      }
    >
      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          {[
            ["general", "General"],
            ["rules", "Attendance Rules"],
            ["schedule", "Work Schedule"],
            ["shifts", "Shifts"],
            ["locations", "Locations"],
            ["devices", "Devices"],
            ["roles", "Roles & Permissions"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v as string}>
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
              <CardDescription>Company identity and formatting defaults.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Row label="Company Name"><Input defaultValue="Nile Digital Group" maxLength={100} /></Row>
              <Row label="Logo"><Button variant="outline" className="w-full">Upload logo</Button></Row>
              <Row label="Time Zone">
                <Select defaultValue="cairo">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cairo">Africa/Cairo (UTC+3)</SelectItem>
                    <SelectItem value="riyadh">Asia/Riyadh (UTC+3)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Date Format">
                <Select defaultValue="dmy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Time Format">
                <Select defaultValue="12">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour</SelectItem>
                    <SelectItem value="24">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Language">
                <Select defaultValue="en">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Currency">
                <Select defaultValue="egp">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="egp">EGP</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Rules</CardTitle>
              <CardDescription>These rules drive how each record is classified.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Row label="Work Start Time"><Input type="time" defaultValue="09:00" /></Row>
              <Row label="Work End Time"><Input type="time" defaultValue="17:00" /></Row>
              <Row label="Grace Period (min)"><Input type="number" defaultValue={10} /></Row>
              <Row label="Minimum Working Hours"><Input type="number" defaultValue={7} step={0.5} /></Row>
              <Row label="Break Duration (min)"><Input type="number" defaultValue={60} /></Row>
              <Row label="Late after (min past grace)"><Input type="number" defaultValue={1} /></Row>
              <Row label="Early leave before (min)"><Input type="number" defaultValue={15} /></Row>
              <Row label="Auto-close missing check-out at"><Input type="time" defaultValue="23:59" /></Row>
              <Row label="Overtime starts after (min)"><Input type="number" defaultValue={30} /></Row>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Validation & duplicate prevention</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Prevent duplicate check-in", "Block a second check-in while a session is open."],
                ["Prevent duplicate check-out", "Ignore repeated check-out taps on the same session."],
                ["Single active session", "Only one open attendance session per employee."],
                ["Require approved device", "Reject check-ins from unregistered devices."],
                ["Require location match", "Validate GPS/IP against the assigned office radius."],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Work Schedule</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border">
              {workSchedule.map((d) => (
                <div key={d.day} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium">{d.day}</span>
                  {d.weekend ? (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      Weekend
                    </span>
                  ) : (
                    <span className="text-sm tabular">{d.hours}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <Card>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
              {shifts.map((s) => (
                <div key={s.name} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground tabular">{s.window}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Grace {s.grace} · {s.employees} employees
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-4">
          <Card>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
              {locations.map((l) => (
                <div key={l.name} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold">{l.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l.address}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {l.employees} employees · geofence {l.radius}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium tabular">{d.id}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>{d.employee}</TableCell>
                      <TableCell>{d.location}</TableCell>
                      <TableCell className="text-muted-foreground">{d.registered}</TableCell>
                      <TableCell className="text-muted-foreground tabular">{d.lastUsed}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            deviceStatusCls[d.status] ?? "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {d.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4 space-y-4">
          <Card>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
              {["Super Admin", "HR Admin", "Manager", "Employee"].map((r) => (
                <div key={r} className="rounded-xl border border-border p-4 text-sm font-medium">
                  {r}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Permission matrix</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-4 pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Employee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionMatrix.map((p) => (
                    <TableRow key={p.permission}>
                      <TableCell className="font-medium">{p.permission}</TableCell>
                      <TableCell>{p.admin}</TableCell>
                      <TableCell>{p.manager}</TableCell>
                      <TableCell>{p.employee}</TableCell>
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
