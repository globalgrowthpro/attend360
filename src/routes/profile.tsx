import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Attend360 Admin" },
      {
        name: "description",
        content: "Update your admin account details, notification preferences and security options.",
      },
      { property: "og:title", content: "My Profile — Attend360 Admin" },
      { property: "og:description", content: "Manage your Attend360 admin account." },
    ],
  }),
  component: AdminProfilePage,
});

function AdminProfilePage() {
  return (
    <AdminShell
      title="My Profile"
      description="HR Admin · Cairo HQ"
      actions={
        <Button size="sm" onClick={() => toast.success("Profile updated")}>
          Save
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Account details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              ["Full Name", "Mona Adel"],
              ["Email", "mona.adel@company.com"],
              ["Phone", "+20 100 444 5566"],
              ["Role", "HR Admin"],
            ].map(([label, value]) => (
              <div key={label}>
                <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
                <Input defaultValue={value} maxLength={255} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notification preferences</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              "Late arrivals",
              "Absences",
              "Missing check-outs",
              "Correction requests",
              "Device registrations",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between text-sm">
                <span>{item}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
