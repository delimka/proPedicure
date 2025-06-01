"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Mail,
  Server,
  Columns,
  Trash,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData extends { id?: number | string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected?: (ids: (number | string)[]) => void;

  emailFilter?: string;
  onEmailFilterChange?: (val: string) => void;

  canNextPage?: boolean;
  onNextPage?: () => void;
  isFetchingNext?: boolean;
}

export function DataTable<TData extends { id?: number | string }, TValue>({
  columns,
  data,
  onDeleteSelected,

  emailFilter,
  onEmailFilterChange,

  canNextPage = false,
  onNextPage,
  isFetchingNext = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // => locally we have  "n" edges, depending on data.length / pageSize
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    initialState: {
      sorting: [{ id: "created_at", desc: true }],
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  const handleDelete = () => {
    if (!onDeleteSelected) return;
    const ids = selectedRows
      .map((bk) => bk.id)
      .filter((id): id is number | string => !!id);
    if (!ids.length) return;
    onDeleteSelected(ids);
  };

  const handleNextPage = async () => {
    if (table.getCanNextPage()) {
      table.nextPage();
    } else if (canNextPage && onNextPage) {
      await onNextPage();
      table.nextPage();
    }
  };

  const handlePreviousPage = () => {
    if (table.getCanPreviousPage()) {
      table.previousPage();
    }
  };
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-wrap items-center py-4 gap-2">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <Input
            placeholder={t("booking-email")}
            value={emailFilter ?? ""}
            onChange={(e) => onEmailFilterChange?.(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          <Input
            placeholder={t("booking-services")}
            value={
              (table.getColumn("serviceNames")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("serviceNames")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto"
              title={t("open-menu")}
            >
              <Columns className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {t(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {onDeleteSelected && (
          <Button
            variant="destructive"
            className="bg-red-400"
            onClick={handleDelete}
            disabled={!selectedRows.length}
          >
            <Trash className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("no-bookings")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
        <div className="text-sm text-muted-foreground">
          {t("selected-count", {
            selected: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>

        <div className="flex items-center space-x-2">
          <span>{t("show")}</span>
          <select
            className="border px-2 py-1 rounded"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>{t("per-page")}</span>
        </div>

        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage() && !canNextPage}
          >
            {isFetchingNext ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
