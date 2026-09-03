import { cn } from "@/lib/utils";
import { statusMeta, type AttendanceStatus } from "@/lib/attendance-data";

export function StatusDot({ status, className }: { status: AttendanceStatus; className?: string }) {
  return (
    <span
      className={cn("inline-block size-2 rounded-full", statusMeta[status].dot, className)}
      aria-hidden
    />
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: AttendanceStatus;
  className?: string;
}) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const map = {
    pending: { label: "Pending", cls: "bg-warning-soft text-warning", dot: "bg-warning" },
    approved: { label: "Approved", cls: "bg-success-soft text-success", dot: "bg-success" },
    rejected: { label: "Rejected", cls: "bg-danger-soft text-danger", dot: "bg-danger" },
  }[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        map.cls,
      )}
    >
      <span className={cn("size-1.5 rounded-full", map.dot)} aria-hidden />
      {map.label}
    </span>
  );
}
