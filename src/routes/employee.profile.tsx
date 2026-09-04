import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, KeyRound, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { EmployeeShell } from "@/components/EmployeeShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { setAvatarUrl, useAvatarUrl } from "@/lib/avatar-store";

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
  const fileRef = useRef<HTMLInputElement>(null);
  const avatar = useAvatarUrl();
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  function onPickAvatar(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be smaller than 3 MB");
      return;
    }
    setAvatarUrl(URL.createObjectURL(file));
    toast.success("Profile photo updated");
  }

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.current || !pw.next) {
      toast.error("Fill in both password fields");
      return;
    }
    if (pw.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pw.next !== pw.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setPw({ current: "", next: "", confirm: "" });
    setPwOpen(false);
    toast.success("Password changed");
  }

  return (
    <EmployeeShell title="My profile">
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Ahmed Ali"
                  className="size-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-xl font-semibold text-primary">
                  AA
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload profile photo"
                className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border border-border bg-card text-foreground shadow-card transition-colors hover:bg-accent"
              >
                <Camera className="size-3.5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPickAvatar(e.target.files?.[0])}
              />
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
          <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
              <Camera className="size-4" /> Upload profile photo
            </Button>
            <Dialog open={pwOpen} onOpenChange={setPwOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <KeyRound className="size-4" /> Change password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Change password</DialogTitle>
                  <DialogDescription>
                    Use at least 8 characters, mixing letters and numbers.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitPassword} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={pw.current}
                      onChange={(e) => setPw({ ...pw, current: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={pw.next}
                      onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={pw.confirm}
                      onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Update password</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
