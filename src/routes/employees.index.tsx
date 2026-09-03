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

export const Route = createFileRoute("/employees/")({
  head: () => ({
    meta: [
      { title: "Employees — TimeTrack Attendance" },
      {
        name: "description",
        content:
          "Search, filter and manage the employee directory with department, location, status and today's attendance state.",
      },
      { property: "og:title", content: "Employees — TimeTrack Attendance" },
      { property: "og:description", content: "Manage your employee directory and attendance setup." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
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
      title="Employees"
      description={`${rows.length} of ${employees.length} employees shown`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Upload className="size-4" /> Import
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Download className="size-4" /> Export
          </Button>
          <Button asChild size="sm">
            <Link to="/employees/new">
              <UserPlus className="size-4" /> Add Employee
            </Link>
          </Button>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 80))}
                placeholder="Search employees..."
                className="pl-9"
                aria-label="Search employees"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {["IT", "HR", "Finance", "Operations", "Marketing"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={loc} onValueChange={setLoc}>
                <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {["Cairo HQ", "Giza Office", "Alexandria Office"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full">Full-time</SelectItem>
                  <SelectItem value="part">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Today</TableHead>
                  <TableHead className="w-10" />
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
                    <TableCell className="tabular text-muted-foreground">{e.code}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell className="text-muted-foreground">{e.position}</TableCell>
                    <TableCell>{e.location}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          e.active ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${e.active ? "bg-success" : "bg-muted-foreground"}`} />
                        {e.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={e.today} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${e.name}`}>
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/employees/$id" params={{ id: e.id }}>View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/attendance">Attendance</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Attendance History</DropdownMenuItem>
                          <DropdownMenuItem>Documents</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Deactivate</DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      No employees match these filters.
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
