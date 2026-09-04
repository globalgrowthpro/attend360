import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Filter,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useCurrentDateTime } from "@/hooks/use-current-date-time";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  attendanceRecords as initialAttendanceRecords,
  statusMeta,
  type AttendanceRecord,
  type AttendanceStatus,
} from "@/lib/attendance-data";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Attend360" },
      {
        name: "description",
        content:
          "Daily attendance log with check-in, check-out, working hours, status badges, location and device for every employee.",
      },
      { property: "og:title", content: "Attendance — Attend360" },
      { property: "og:description", content: "Review and correct daily attendance records." },
    ],
  }),
  component: AttendancePage,
});

/**
 * Normalizes dates across multiple formats (e.g. "03 Sep 2026", "03-09-2026", "2026-09-03")
 * into a consistent standard key (YYYY-MM-DD) for duplicate detection.
 */
function normalizeDate(d: string): string {
  if (!d) return "";
  const cleaned = d.trim().replace(/,/g, "");

  // Try standard parse (handles "03 Sep 2026", "Sep 3 2026", etc.)
  const parsed = Date.parse(cleaned);
  if (!isNaN(parsed)) {
    const dt = new Date(parsed);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }

  // Handle dd-mm-yyyy or yyyy-mm-dd
  const parts = cleaned.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
    }
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }

  return cleaned.toLowerCase();
}

/**
 * Generates a unique key for employee + date to strictly reject duplicate records for the same day.
 */
function getRecordKey(code: string, employee: string, date: string): string {
  const empKey = (code || employee).trim().toLowerCase();
  const dateKey = normalizeDate(date);
  return `${empKey}___${dateKey}`;
}

type StagedRecord = Omit<AttendanceRecord, "id"> & {
  tempId: string;
  isDuplicate: boolean;
  duplicateReason?: string;
};

// Ready-made template data: contains both valid new records and test duplicate entries
const READY_MADE_TEMPLATE_DATA: Omit<AttendanceRecord, "id">[] = [
  {
    employee: "Ziad Tarek",
    code: "EMP008",
    date: "03 Sep 2026",
    checkIn: "08:50 AM",
    checkOut: "05:10 PM",
    hours: "8h 20m",
    status: "present",
    location: "Alexandria Office",
    device: "PC-008",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Web",
  },
  {
    employee: "Salma Fawzy",
    code: "EMP009",
    date: "03 Sep 2026",
    checkIn: "09:18 AM",
    checkOut: "05:30 PM",
    hours: "8h 12m",
    status: "late",
    location: "Cairo HQ",
    device: "Mobile-119",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Mobile",
  },
  {
    employee: "Tarek Nabil",
    code: "EMP010",
    date: "03 Sep 2026",
    checkIn: "08:45 AM",
    checkOut: "05:00 PM",
    hours: "8h 15m",
    status: "present",
    location: "Giza Office",
    device: "PC-022",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Biometric",
  },
  {
    employee: "Laila Samir",
    code: "EMP011",
    date: "03 Sep 2026",
    checkIn: "08:59 AM",
    checkOut: "05:01 PM",
    hours: "8h 02m",
    status: "present",
    location: "Cairo HQ",
    device: "Mobile-130",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Mobile",
  },
  // Intentional duplicate of Ahmed Ali (EMP001) on same day "03 Sep 2026"
  {
    employee: "Ahmed Ali",
    code: "EMP001",
    date: "03 Sep 2026",
    checkIn: "08:55 AM",
    checkOut: "05:05 PM",
    hours: "8h 10m",
    status: "present",
    location: "Cairo HQ",
    device: "PC-001",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Web",
  },
  // Intentional duplicate of Sara Hassan (EMP002) on same day "03 Sep 2026"
  {
    employee: "Sara Hassan",
    code: "EMP002",
    date: "03 Sep 2026",
    checkIn: "09:27 AM",
    checkOut: "—",
    hours: "7h 33m",
    status: "late",
    location: "Cairo HQ",
    device: "Mobile-114",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Mobile",
  },
  // Intra-batch duplicate test (another row for Ziad Tarek on same day)
  {
    employee: "Ziad Tarek",
    code: "EMP008",
    date: "03 Sep 2026",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    hours: "8h 00m",
    status: "present",
    location: "Alexandria Office",
    device: "PC-008",
    scheduled: "09:00 AM – 05:00 PM",
    source: "Web",
  },
];

function downloadCsvTemplate() {
  const headers = "Employee,Code,Date,Check In,Check Out,Hours,Status,Location,Device";
  const rows = [
    "Ziad Tarek,EMP008,03 Sep 2026,08:50 AM,05:10 PM,8h 20m,present,Alexandria Office,PC-008",
    "Salma Fawzy,EMP009,03 Sep 2026,09:18 AM,05:30 PM,8h 12m,late,Cairo HQ,Mobile-119",
    "Tarek Nabil,EMP010,03 Sep 2026,08:45 AM,05:00 PM,8h 15m,present,Giza Office,PC-022",
    "Laila Samir,EMP011,03 Sep 2026,08:59 AM,05:01 PM,8h 02m,present,Cairo HQ,Mobile-130",
    "Ahmed Ali,EMP001,03 Sep 2026,08:55 AM,05:05 PM,8h 10m,present,Cairo HQ,PC-001",
    "Sara Hassan,EMP002,03 Sep 2026,09:27 AM,,7h 33m,late,Cairo HQ,Mobile-114",
  ];
  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers, ...rows].join("\n"));
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", "attend360_attendance_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Ready-made CSV template downloaded");
}

function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [stagedRecords, setStagedRecords] = useState<StagedRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { date, time } = useCurrentDateTime();
  const { t } = useI18n();

  // Evaluate candidate records against existing database records and intra-batch duplicates
  const evaluateRecords = (rawList: Omit<AttendanceRecord, "id">[]) => {
    const existingKeys = new Set(
      records.map((r) => getRecordKey(r.code, r.employee, r.date))
    );
    const seenInBatch = new Set<string>();

    const staged: StagedRecord[] = rawList.map((r, index) => {
      const key = getRecordKey(r.code, r.employee, r.date);
      let isDup = false;
      let reason = "";

      if (existingKeys.has(key)) {
        isDup = true;
        reason = `Duplicate: Record already exists for ${r.code || r.employee} on ${r.date}`;
      } else if (seenInBatch.has(key)) {
        isDup = true;
        reason = `Duplicate: Multiple records for ${r.code || r.employee} on ${r.date} in same file`;
      } else {
        seenInBatch.add(key);
      }

      return {
        ...r,
        tempId: `staged-${Date.now()}-${index}`,
        isDuplicate: isDup,
        duplicateReason: reason,
      };
    });

    setStagedRecords(staged);
  };

  const handleLoadReadyMade = () => {
    evaluateRecords(READY_MADE_TEMPLATE_DATA);
    toast.info("Ready-made template loaded. Review duplicates below.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        toast.error("CSV file is empty or missing headers");
        return;
      }

      const rows: Omit<AttendanceRecord, "id">[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
        if (cols.length >= 3 && cols[0]) {
          const [
            employee = "",
            code = "",
            recDate = "",
            checkIn = "",
            checkOut = "",
            hours = "",
            status = "present",
            location = "Cairo HQ",
            device = "PC",
          ] = cols;

          const validStatus = [
            "present",
            "late",
            "absent",
            "leave",
            "early-leave",
            "missing-checkout",
          ].includes(status.toLowerCase())
            ? (status.toLowerCase() as AttendanceStatus)
            : "present";

          rows.push({
            employee: employee || `Employee ${i}`,
            code: code || `EMP${String(i).padStart(3, "0")}`,
            date: recDate || date,
            checkIn: checkIn || null,
            checkOut: checkOut || null,
            hours: hours || "8h 00m",
            status: validStatus,
            location: location || "Cairo HQ",
            device: device || "Web",
            scheduled: "09:00 AM – 05:00 PM",
            source: "CSV Import",
          });
        }
      }

      if (rows.length === 0) {
        toast.error("No valid attendance rows found in file");
        return;
      }

      evaluateRecords(rows);
      toast.info(`Parsed ${rows.length} records from ${file.name}`);
    };
    reader.readAsText(file);
    // Reset file input value so user can re-upload if needed
    e.target.value = "";
  };

  const handleCommitImport = () => {
    const validOnly = stagedRecords.filter((r) => !r.isDuplicate);
    if (validOnly.length === 0) {
      toast.error("No valid non-duplicate records to import.");
      return;
    }

    const newRecords: AttendanceRecord[] = validOnly.map((r, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      employee: r.employee,
      code: r.code,
      date: r.date,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      hours: r.hours,
      status: r.status,
      location: r.location,
      device: r.device,
      scheduled: r.scheduled,
      source: r.source,
    }));

    setRecords((prev) => [...newRecords, ...prev]);
    const rejectedDuplicates = stagedRecords.filter((r) => r.isDuplicate).length;

    toast.success(
      `Successfully imported ${validOnly.length} record${
        validOnly.length > 1 ? "s" : ""
      }${
        rejectedDuplicates > 0
          ? ` (${rejectedDuplicates} duplicate${
              rejectedDuplicates > 1 ? "s" : ""
            } rejected)`
          : ""
      }`
    );

    setIsImportOpen(false);
    setStagedRecords([]);
  };

  // Dynamic KPI counts updated according to state
  const counts = useMemo(() => {
    const presentCount = records.filter((r) => r.status === "present").length;
    const lateCount = records.filter((r) => r.status === "late").length;
    const absentCount = records.filter((r) => r.status === "absent").length;
    const leaveCount = records.filter((r) => r.status === "leave").length;
    const earlyCount = records.filter((r) => r.status === "early-leave").length;
    const missingCount = records.filter((r) => r.status === "missing-checkout").length;

    const basePresent = 213;
    const baseLate = 12;
    const baseAbsent = 18;
    const baseLeave = 5;
    const baseEarly = 4;
    const baseMissing = 3;

    const initialP = initialAttendanceRecords.filter((r) => r.status === "present").length;
    const initialL = initialAttendanceRecords.filter((r) => r.status === "late").length;
    const initialA = initialAttendanceRecords.filter((r) => r.status === "absent").length;
    const initialLv = initialAttendanceRecords.filter((r) => r.status === "leave").length;
    const initialE = initialAttendanceRecords.filter((r) => r.status === "early-leave").length;
    const initialM = initialAttendanceRecords.filter((r) => r.status === "missing-checkout").length;

    return [
      { label: t("Present"), value: basePresent + Math.max(0, presentCount - initialP), cls: "bg-success-soft text-success" },
      { label: t("Late"), value: baseLate + Math.max(0, lateCount - initialL), cls: "bg-warning-soft text-warning" },
      { label: t("Absent"), value: baseAbsent + Math.max(0, absentCount - initialA), cls: "bg-danger-soft text-danger" },
      { label: t("On Leave"), value: baseLeave + Math.max(0, leaveCount - initialLv), cls: "bg-info-soft text-info" },
      { label: t("Early Leave"), value: baseEarly + Math.max(0, earlyCount - initialE), cls: "bg-violet-soft text-violet" },
      { label: t("Missing Check-out"), value: baseMissing + Math.max(0, missingCount - initialM), cls: "bg-secondary text-secondary-foreground" },
    ];
  }, [records, t]);

  const validStagedCount = stagedRecords.filter((r) => !r.isDuplicate).length;
  const duplicateStagedCount = stagedRecords.filter((r) => r.isDuplicate).length;

  return (
    <AdminShell
      title={t("Attendance")}
      description={`${date} · ${time} · ${records.length} records`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsImportOpen(true);
              if (stagedRecords.length === 0) {
                // Auto-load ready-made template so user sees the preview immediately
                evaluateRecords(READY_MADE_TEMPLATE_DATA);
              }
            }}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Upload className="size-4" /> {t("Import")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export queued")}>
            <Download className="size-4" /> {t("Export")}
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Filter className="size-4" /> {t("Filters")}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {counts.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${c.cls}`}>
                {c.label}
              </span>
              <p className="mt-2 text-2xl font-semibold tabular">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{t("Attendance Log")}</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
              {records.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select defaultValue="today">
              <SelectTrigger className="w-full sm:w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("Today")}</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">{t("This week")}</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-loc">
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-loc">{t("All Locations")}</SelectItem>
                <SelectItem value="cairo">{t("Cairo HQ")}</SelectItem>
                <SelectItem value="giza">{t("Giza Office")}</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-dep">
              <SelectTrigger className="w-full sm:w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-dep">All Departments</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Employee")}</TableHead>
                <TableHead>{t("Date")}</TableHead>
                <TableHead>{t("Check In")}</TableHead>
                <TableHead>{t("Check Out")}</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Location")}</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(r)}
                >
                  <TableCell>
                    <p className="font-medium">{r.employee}</p>
                    <p className="text-xs text-muted-foreground tabular">{r.code}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="tabular">{r.checkIn ?? "—"}</TableCell>
                  <TableCell className="tabular">{r.checkOut ?? "—"}</TableCell>
                  <TableCell className="tabular">{r.hours}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell className="text-muted-foreground">{r.device}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Status legend</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(Object.keys(statusMeta) as Array<keyof typeof statusMeta>).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </CardContent>
      </Card>

      {/* Record Details Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>Attendance Details</SheetTitle>
                <SheetDescription>
                  {selected.employee} · {selected.date}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Check In", selected.checkIn ?? "—"],
                    ["Check Out", selected.checkOut ?? "—"],
                    ["Working Hours", selected.hours],
                    ["Scheduled", selected.scheduled],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-border p-3">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="mt-0.5 text-sm font-medium tabular">{v}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">{t("Status")}</dt>
                    <dd><StatusBadge status={selected.status} /></dd>
                  </div>
                  {[
                    [t("Location"), selected.location],
                    ["Device", selected.device],
                    ["IP Address", "••••••••"],
                    ["Source", selected.source],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Separator />
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Admin note</p>
                  <Textarea rows={3} maxLength={500} placeholder="Add a note to this record..." />
                </div>
                <div className="grid grid-cols-2 gap-2 pb-6">
                  <Button onClick={() => toast.success("Record approved")}>Approve</Button>
                  <Button variant="outline" onClick={() => toast.error("Record rejected")}>
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Edit mode enabled")}>
                    Edit Attendance
                  </Button>
                  <Button variant="ghost" onClick={() => toast.info("Activity log opened")}>
                    Activity Log
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Import from Ready-Made Template or CSV Modal */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileSpreadsheet className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {t("Import Attendance Records")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("Duplicate records on the same day are rejected")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 py-2 border-y border-border/60">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleLoadReadyMade}
              className="gap-1.5 shadow-sm"
            >
              <Sparkles className="size-4" />
              {t("Load Ready-Made Template")}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="size-4" />
              Upload Custom CSV
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={downloadCsvTemplate}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Download className="size-4" />
              {t("Download CSV Template")}
            </Button>
          </div>

          {/* Staged Summary Badges */}
          {stagedRecords.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3.5" />
                  {validStagedCount} Ready to Import
                </span>
                {duplicateStagedCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-rose-600 dark:text-rose-400 font-medium">
                    <XCircle className="size-3.5" />
                    {duplicateStagedCount} {t("Duplicate - Skipped")}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground">
                Total parsed: {stagedRecords.length}
              </span>
            </div>
          )}

          {/* Duplicate Alert Banner */}
          {duplicateStagedCount > 0 && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-medium">Strict Duplicate Protection Active</p>
                <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                  {duplicateStagedCount} record(s) were flagged as duplicates because an attendance entry for that employee already exists on the same day. These rows will be automatically skipped upon import.
                </p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className="flex-1 overflow-y-auto rounded-lg border border-border/80">
            {stagedRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
                <FileSpreadsheet className="size-10 mb-2 opacity-40" />
                <p className="font-medium">No records loaded yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Load Ready-Made Template" above to preview sample records and duplicate detection.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/60 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>In / Out</TableHead>
                    <TableHead>Shift Status</TableHead>
                    <TableHead>Note / Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stagedRecords.map((r) => (
                    <TableRow
                      key={r.tempId}
                      className={
                        r.isDuplicate
                          ? "bg-rose-50/60 dark:bg-rose-950/20 opacity-75"
                          : "hover:bg-muted/40"
                      }
                    >
                      <TableCell>
                        {r.isDuplicate ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                            <XCircle className="size-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" /> Valid
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-xs">{r.employee}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{r.code}</p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {r.date}
                      </TableCell>
                      <TableCell className="text-xs tabular whitespace-nowrap">
                        {r.checkIn ?? "—"} → {r.checkOut ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-xs">
                        {r.isDuplicate ? (
                          <span className="text-rose-600 dark:text-rose-400 font-medium">
                            {r.duplicateReason}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Ready to add ({r.location})
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsImportOpen(false);
                setStagedRecords([]);
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={validStagedCount === 0}
              onClick={handleCommitImport}
              className="gap-1.5"
            >
              <CheckCircle2 className="size-4" />
              {t("Import Valid Records")} ({validStagedCount})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
