import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, MoreVertical, Search, Upload, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employees } from "@/lib/attendance-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/employees/")({
  head: () => ({
    meta: [
      { title: "Employees — Attend360 Attendance" },
      {
        name: "description",
        content:
          "Search, filter and manage the employee directory with department, location, status and today's attendance state.",
      },
      { property: "og:title", content: "Employees — Attend360 Attendance" },
      { property: "og:description", content: "Manage your employee directory and attendance setup." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [loc, setLoc] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = useMemo(
    () =>
      employees.filter((e) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q);
        return (
          matchesQuery &&
          (dept === "all" || e.department === dept) &&
          (loc === "all" || e.location === loc) &&
          (status === "all" || (status === "active" ? e.active : !e.active))
        );
      }),
    [query, dept, loc, status],
  );

  return (
    <AdminShell
      title={t("Employees")}
      description={`${rows.length} ${t("of")} ${employees.length} ${t("employees shown")}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Upload className="size-4" /> {t("Import")}
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Download className="size-4" /> {t("Export")}
          </Button>
          <Button asChild size="sm">
            <Link to="/employees/new">
              <UserPlus className="size-4" /> {t("Add Employee")}
            </Link>
          </Button>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 80))}
                placeholder={t("Search employees...")}
                className="ps-9"
                aria-label={t("Search employees")}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger><SelectValue placeholder={t("Department")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Departments")}</SelectItem>
                  {["IT", "HR", "Finance", "Operations", "Marketing"].map((d) => (
                    <SelectItem key={d} value={d}>{t(d)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={loc} onValueChange={setLoc}>
                <SelectTrigger><SelectValue placeholder={t("Location")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Locations")}</SelectItem>
                  {["Cairo HQ", "Giza Office", "Alexandria Office"].map((l) => (
                    <SelectItem key={l} value={l}>{t(l)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder={t("Status")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("Any Status")}</SelectItem>
                  <SelectItem value="active">{t("Active")}</SelectItem>
                  <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Types")}</SelectItem>
                  <SelectItem value="full">{t("Full-time")}</SelectItem>
                  <SelectItem value="part">{t("Part-time")}</SelectItem>
                  <SelectItem value="contract">{t("Contract")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Employee")}</TableHead>
                  <TableHead>{t("ID")}</TableHead>
                  <TableHead>{t("Department")}</TableHead>
                  <TableHead>{t("Position")}</TableHead>
                  <TableHead>{t("Location")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Today")}</TableHead>
                  <TableHead className="w-10 text-end">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <Link to="/employees/$id" params={{ id: e.id }} className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                          {e.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                        <span className="font-medium hover:text-primary">{e.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="tabular text-muted-foreground"><span dir="ltr">{e.code}</span></TableCell>
                    <TableCell>{t(e.department)}</TableCell>
                    <TableCell className="text-muted-foreground">{e.position}</TableCell>
                    <TableCell>{t(e.location)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          e.active ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${e.active ? "bg-success" : "bg-muted-foreground"}`} />
                        {e.active ? t("Active") : t("Inactive")}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={e.today} /></TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${e.name}`}>
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/employees/$id" params={{ id: e.id }}>{t("View Profile")}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/attendance">{t("Attendance")}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>{t("Attendance History")}</DropdownMenuItem>
                          <DropdownMenuItem>{t("Documents")}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>{t("Deactivate")}</DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">{t("Delete")}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      {t("No employees match these filters.")}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
