import { createFileRoute } from "@tanstack/react-router";
import { AlarmClock, BellRing, Smartphone, UserPlus } from "lucide-react";

import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notifications, statusMeta, type AttendanceStatus } from "@/lib/attendance-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — TimeTrack Attendance" },
      {
        name: "description",
        content:
          "Notification center for late arrivals, absences, missing check-outs, correction requests and device registrations.",
      },
      { property: "og:title", content: "Notifications — TimeTrack Attendance" },
      { property: "og:description", content: "Every attendance alert in one timeline." },
    ],
  }),
  component: NotificationsPage,
});

const icons: Record<string, typeof BellRing> = {
  late: AlarmClock,
  absent: BellRing,
  correction: BellRing,
  device: Smartphone,
  missing: AlarmClock,
  new: UserPlus,
};

function NotificationsPage() {
  return (
    <AdminShell
      title="Notifications"
      description="4 unread"
      actions={
        <Button variant="outline" size="sm">
          Mark all read
        </Button>
      }
    >
      <div className="space-y-5">
        {notifications.map((group) => (
          <div key={group.group}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.group}
            </p>
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {group.items.map((item) => {
                  const Icon = icons[item.icon] ?? BellRing;
                  const meta = statusMeta[item.type as AttendanceStatus];
                  return (
                    <div key={item.title} className="flex items-start gap-3 p-4">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${meta.badge}`}>
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.meta}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        View
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
