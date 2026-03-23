import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { useTaxTypes, useTaxDeclarations } from "@/hooks/useTaxDeclarations";
import { TaxStatusCell } from "@/components/tax/TaxStatusCell";
import type { TaxView, TaxPeriodCell, TaxDeclarationRow } from "@/types/taxDeclaration";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const PAGE_SIZES = [50, 100, 200];

export default function ToKhaiThuePage() {
  const [view, setView] = useState<TaxView>("quarterly");
  const [taxType, setTaxType] = useState("gtgt");
  const [year, setYear] = useState(currentYear);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [colSearch, setColSearch] = useState<Record<string, string>>({});

  const { data: taxTypes } = useTaxTypes();
  const { data, isLoading } = useTaxDeclarations({ view, taxType, year, page, limit, search });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const periods = useMemo(() => {
    if (view === "quarterly") return [
      { key: "q1", label: "Q1" }, { key: "q2", label: "Q2" },
      { key: "q3", label: "Q3" }, { key: "q4", label: "Q4" },
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      key: `t${i + 1}`, label: `T${i + 1}`,
    }));
  }, [view]);

  // Filter items by column search
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items;
    const clientFilter = colSearch.client?.toLowerCase();
    if (clientFilter) {
      items = items.filter((r) => r.clientName.toLowerCase().includes(clientFilter));
    }
    return items;
  }, [data?.items, colSearch]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Kết quả tờ khai thuế</h1>

      {/* Tabs */}
      <Tabs value={view} onValueChange={(v) => { setView(v as TaxView); setPage(1); }}>
        <TabsList className="bg-muted/50 h-auto gap-1 p-1">
          <TabsTrigger value="quarterly" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2">
            Khai thuế theo quý
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2">
            Khai thuế theo tháng
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground">Kết quả khai thuế</span>

        <Select value={taxType} onValueChange={(v) => { setTaxType(v); setPage(1); }}>
          <SelectTrigger className="w-[260px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {taxTypes?.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year.toString()} onValueChange={(v) => { setYear(Number(v)); setPage(1); }}>
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm"
              className="pl-9 h-9 w-[200px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button size="sm" className="h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-1" />
            Tìm kiếm
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Tổng: <strong className="text-foreground">{data?.total || 0}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <div className="border rounded-lg bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10 sticky left-0 z-20 bg-muted/50"></TableHead>
                  <TableHead className="w-14 text-center sticky left-10 z-20 bg-muted/50">STT</TableHead>
                  <TableHead className="min-w-[250px] sticky left-[88px] z-20 bg-muted/50 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                    <div className="space-y-1">
                      <span>Khách hàng*</span>
                      <Input
                        placeholder="Tìm kiếm"
                        className="h-7 text-xs"
                        value={colSearch.client || ""}
                        onChange={(e) => setColSearch((p) => ({ ...p, client: e.target.value }))}
                      />
                    </div>
                  </TableHead>
                  {periods.map((p) => (
                    <TableHead key={p.key} className="min-w-[180px] text-center">
                      <div className="space-y-1">
                        <span>{p.label}</span>
                        <Input
                          placeholder="Tìm kiếm"
                          className="h-7 text-xs"
                          value={colSearch[p.key] || ""}
                          onChange={(e) => setColSearch((prev) => ({ ...prev, [p.key]: e.target.value }))}
                        />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3 + periods.length} className="text-center py-10 text-muted-foreground">
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((row, idx) => (
                    <TableRowWithExpand
                      key={row.id}
                      row={row}
                      idx={(page - 1) * limit + idx}
                      periods={periods}
                      expanded={expandedRows.has(row.id)}
                      onToggle={() => toggleExpand(row.id)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị {Math.min((page - 1) * limit + 1, data?.total || 0)}-{Math.min(page * limit, data?.total || 0)} / {data?.total || 0}
        </div>
        <div className="flex items-center gap-2">
          <Select value={limit.toString()} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[110px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => <SelectItem key={s} value={s.toString()}>{s} / trang</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ‹
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-component for expandable rows ---

interface RowProps {
  row: TaxDeclarationRow;
  idx: number;
  periods: { key: string; label: string }[];
  expanded: boolean;
  onToggle: () => void;
}

function TableRowWithExpand({ row, idx, periods, expanded, onToggle }: RowProps) {
  return (
    <>
      <TableRow className={idx % 2 === 0 ? "bg-card" : "bg-muted/10"}>
        <TableCell className="sticky left-0 z-10 bg-inherit">
          <button onClick={onToggle} className="p-1 rounded hover:bg-muted">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </TableCell>
        <TableCell className="text-center text-sm sticky left-10 z-10 bg-inherit">{idx + 1}</TableCell>
        <TableCell className="sticky left-[88px] z-10 bg-inherit shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
              style={{ backgroundColor: row.clientColor }}
            >
              {row.clientInitial}
            </div>
            <span className="text-sm font-medium truncate max-w-[200px]">{row.clientName}</span>
          </div>
        </TableCell>
        {periods.map((p) => {
          const cell = row[p.key] as TaxPeriodCell | undefined;
          return (
            <TableCell key={p.key} className="p-0">
              {cell ? (
                <TaxStatusCell cell={cell} declarationId={row.id} period={p.key} />
              ) : (
                <span className="text-xs text-muted-foreground p-2">—</span>
              )}
            </TableCell>
          );
        })}
      </TableRow>

      {expanded && (
        <TableRow className="bg-muted/20">
          <TableCell colSpan={3 + periods.length} className="px-12 py-3">
            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">Nhân viên phụ trách: </span>
                <span className="font-medium text-foreground">{row.assignedStaff}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Ghi chú: </span>
                <span className="text-foreground">—</span>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
