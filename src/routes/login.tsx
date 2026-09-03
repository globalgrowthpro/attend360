import { createFileRoute, Link } from "@tanstack/react-router";

import logoAsset from "@/assets/attend360-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Attend360 Attendance" },
      {
        name: "description",
        content: "Sign in to Attend360 to check in, review attendance or manage your organization.",
      },
      { property: "og:title", content: "Sign in — Attend360 Attendance" },
      { property: "og:description", content: "Access the Attend360 admin and employee panels." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
<div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-white p-1.5">
            <img src={logoAsset.url} alt="Attend360" className="h-8 w-auto" />
          </div>
        </div>
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            Attendance that reflects how your teams actually work.
          </h2>
          <p className="text-sm opacity-80">
            Shift rules, grace periods, device validation, corrections and reporting — one connected
            attendance record.
          </p>
        </div>
        <p className="text-xs opacity-70">248 employees · 3 locations · 4 shifts</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="space-y-4 p-6">
            <div>
              <h1 className="text-xl font-semibold">Sign in</h1>
              <p className="text-sm text-muted-foreground">Use your work account to continue.</p>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">Email</Label>
              <Input type="email" placeholder="name@company.com" maxLength={255} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">Password</Label>
              <Input type="password" placeholder="••••••••" maxLength={72} />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> Remember this device
            </label>
            <Button asChild className="w-full">
              <Link to="/">Sign in as Admin</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/employee">Sign in as Employee</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo preview — no credentials required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
