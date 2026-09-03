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
  const [tab, setTab] = useState("pending");
  const rows = corrections.filter((c) => (tab === "all" ? true : c.status === tab));

  return (
    <AdminShell
      title="Correction Requests"
      description={`${corrections.filter((c) => c.status === "pending").length} awaiting your review`}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {["pending", "approved", "rejected", "all"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="mt-4">
        <CardContent className="overflow-x-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="font-medium">{c.employee}</p>
                    <p className="text-xs text-muted-foreground tabular">{c.code}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.date}</TableCell>
                  <TableCell>{c.field}</TableCell>
                  <TableCell className="tabular">{c.current}</TableCell>
                  <TableCell className="tabular font-medium text-primary">{c.requested}</TableCell>
                  <TableCell className="max-w-[240px] text-sm text-muted-foreground">{c.reason}</TableCell>
                  <TableCell><RequestStatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-right">
                    {c.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => toast.success(`Approved for ${c.employee}`)}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.error(`Rejected for ${c.employee}`)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Resolved {c.submitted}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Nothing here right now.
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
