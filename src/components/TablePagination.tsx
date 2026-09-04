import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel?: string;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 15, 20, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  itemLabel,
  className = "",
}: TablePaginationProps) {
  const { t } = useI18n();

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show (e.g. max 5 around current)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-3 border-t border-border ${className}`}
    >
      {/* Left: Summary Count */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <span>
            {t("Showing")}{" "}
            <span className="font-semibold text-foreground tabular">{from}</span>{" "}
            {t("to")}{" "}
            <span className="font-semibold text-foreground tabular">{to}</span>{" "}
            {t("of")}{" "}
            <span className="font-semibold text-foreground tabular">{totalItems}</span>{" "}
            {itemLabel ? t(itemLabel) : ""}
          </span>
        ) : (
          <span>{t("0 records")}</span>
        )}
      </div>

      {/* Right: Rows per page + Page Navigation */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-end sm:self-auto">
        {/* Rows per page selector */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="whitespace-nowrap">{t("Rows per page")}:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              onPageSizeChange(Number(val));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-[72px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)} className="text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page text indicator */}
        <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          {t("Page")}{" "}
          <span className="font-semibold text-foreground tabular">{currentPage}</span>{" "}
          {t("of")}{" "}
          <span className="font-semibold text-foreground tabular">{Math.max(1, totalPages)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            title={t("First page")}
            aria-label={t("First page")}
          >
            <ChevronsLeft className="size-4 rtl:rotate-180" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            title={t("Previous")}
            aria-label={t("Previous")}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </Button>

          {/* Direct page number buttons on larger screens */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((p, idx) =>
              p === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 text-xs text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  className="size-8 text-xs tabular font-medium"
                  onClick={() => onPageChange(p)}
                  aria-label={`${t("Page")} ${p}`}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </Button>
              )
            )}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            title={t("Next")}
            aria-label={t("Next")}
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            title={t("Last page")}
            aria-label={t("Last page")}
          >
            <ChevronsRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
