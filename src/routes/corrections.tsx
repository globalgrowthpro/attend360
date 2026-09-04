import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/AdminShell";
import { RequestStatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { corrections } from "@/lib/attendance-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/corrections")({
  head: () => ({
    meta: [
      { title: "Correction Requests — Attend360" },
      {
        name: "description",
        content:
          "Review, approve or reject employee attendance correction requests with the original and requested times side by side.",
      },
      { property: "og:title", content: "Correction Requests — Attend360" },
      { property: "og:description", content: "Approve or reject attendance corrections in one place." },
    ],
  }),
  component: CorrectionsPage,
});

function CorrectionsPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState("pending");
  const rows = corrections.filter((c) => (tab === "all" ? true : c.status === tab));

  return (
    <AdminShell
      title={t("Correction Requests")}
      description={`${corrections.filter((c) => c.status === "pending").length} ${t("awaiting your review")}`}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {["pending", "approved", "rejected", "all"].map((item) => (
            <TabsTrigger key={item} value={item} className="capitalize">
              {t(item)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="mt-4">
        <CardContent className="overflow-x-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Employee")}</TableHead>
                <TableHead>{t("Date")}</TableHead>
                <TableHead>{t("Field")}</TableHead>
                <TableHead>{t("Current")}</TableHead>
                <TableHead>{t("Requested")}</TableHead>
                <TableHead>{t("Reason")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-end">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="font-medium">{c.employee}</p>
                    <p className="text-xs text-muted-foreground tabular"><span dir="ltr">{c.code}</span></p>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap"><span dir="ltr">{c.date}</span></TableCell>
                  <TableCell>{t(c.field)}</TableCell>
                  <TableCell className="tabular"><span dir="ltr">{c.current}</span></TableCell>
                  <TableCell className="tabular font-medium text-primary"><span dir="ltr">{c.requested}</span></TableCell>
                  <TableCell className="max-w-[240px] text-sm text-muted-foreground" dir="auto">{c.reason}</TableCell>
                  <TableCell><RequestStatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-end">
                    {c.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => toast.success(`Approved for ${c.employee}`)}>
                          {t("Approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.error(`Rejected for ${c.employee}`)}
                        >
                          {t("Reject")}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{t("Resolved")} {c.submitted}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    {t("Nothing here right now.")}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
