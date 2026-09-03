import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { EmployeeShell } from "@/components/EmployeeShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/employee/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Attend360" },
      {
        name: "description",
        content:
          "Personal details, assigned shift and location, registered devices and notification preferences.",
      },
      { property: "og:title", content: "My Profile — Attend360" },
      { property: "og:description", content: "Your work profile, shift and registered devices." },
    ],
  }),
  component: EmployeeProfile,
});

function EmployeeProfile() {
  return (
    <EmployeeShell title="My profile">
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-xl font-semibold text-primary">
              AA
            </div>
            <div>
              <p className="text-lg font-semibold">Ahmed Ali</p>
              <p className="text-sm text-muted-foreground">EMP001 · Software Developer</p>
              <p className="text-sm text-muted-foreground">IT Department · Cairo HQ</p>
              <span className="mt-1 inline-block rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success">
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Work setup</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border p-4 pt-0">
            {[
              ["Shift", "Morning Shift"],
              ["Working days", "Sun – Thu"],
              ["Expected hours", "09:00 – 17:00"],
              ["Grace period", "10 min"],
              ["Manager", "Khaled Nabil"],
              ["Joined", "12 Jan 2023"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">My devices</CardTitle></CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {[
              ["PC-001", "Desktop · Cairo HQ", "Approved", "bg-success-soft text-success"],
              ["Mobile-118", "Mobile · Personal", "Pending", "bg-warning-soft text-warning"],
            ].map(([id, meta, status, cls]) => (
              <div key={id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium tabular">{id}</p>
                  <p className="text-xs text-muted-foreground">{meta}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{status}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full">Register this device</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {["Check-in reminder", "Missing check-out alert", "Correction updates"].map((item) => (
              <div key={item} className="flex items-center justify-between text-sm">
                <span>{item}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button asChild variant="outline" className="w-full">
          <Link to="/login">
            <LogOut className="size-4" /> Logout
          </Link>
        </Button>
      </div>
    </EmployeeShell>
  );
}
