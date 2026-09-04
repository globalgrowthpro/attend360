import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <AdminShell
      title={t("My Profile")}
      description={`HR Admin · ${t("Cairo HQ")}`}
      actions={
        <Button size="sm" onClick={() => toast.success(t("Profile updated"))}>
          {t("Save")}
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">{t("Account details")}</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">{t("Full Name")}</Label>
              <Input defaultValue="Mona Adel" maxLength={255} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">{t("Email")}</Label>
              <Input defaultValue="mona.adel@company.com" maxLength={255} dir="ltr" className="text-start" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">{t("Phone")}</Label>
              <Input defaultValue="+20 100 741 9344" maxLength={255} dir="ltr" className="text-start" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-muted-foreground">{t("Role")}</Label>
              <Input defaultValue="HR Admin" maxLength={255} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{t("Notification preferences")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              "Late arrivals",
              "Absences",
              "Missing check-outs",
              "Correction requests",
              "Device registrations",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between text-sm">
                <span>{t(item)}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
