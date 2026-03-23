import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Settings, Eye, EyeOff, ShoppingCart, TrendingUp, Receipt,
  Users, Building, PackageOpen, Calculator, Landmark, CheckCircle, XCircle,
} from "lucide-react";
import { StatusTable } from "@/components/business-status/StatusTable";
import {
  useClientDropdown, useRevenueChart, useVatSummary, useCredentials,
  useServiceInfo, useTaxDeclaration, useAnnualTax, useBusinessStatusData,
} from "@/hooks/useBusinessStatus";

const fmt = (v: number) => v === 0 ? "0" : new Intl.NumberFormat("vi-VN").format(v);
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function TrangThaiDNPage() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [annualYear, setAnnualYear] = useState(currentYear);
  const [statusYear, setStatusYear] = useState(currentYear);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  const { data: clients, isLoading: clientsLoading } = useClientDropdown();
  const { data: revenueChart, isLoading: chartLoading } = useRevenueChart(selectedClientId);
  const { data: vatSummary, isLoading: vatLoading } = useVatSummary(selectedClientId);
  const { data: credentials, isLoading: credLoading } = useCredentials(selectedClientId);
  const { data: serviceInfo, isLoading: svcLoading } = useServiceInfo(selectedClientId);
  const { data: taxDecl, isLoading: declLoading } = useTaxDeclaration(selectedClientId);
  const { data: annualTax, isLoading: annualLoading } = useAnnualTax(selectedClientId, annualYear);
  const { data: bizStatus, isLoading: bizLoading } = useBusinessStatusData(selectedClientId, statusYear);

  const selectedClient = clients?.find((c) => c.id === selectedClientId);

  const togglePassword = (id: number) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Trạng thái doanh nghiệp</h1>
      </div>

      {/* Client selector */}
      <Card className="p-4">
        <label className="text-sm font-medium text-foreground mb-2 block">Chọn khách hàng</label>
        <Select
          value={selectedClientId?.toString() || ""}
          onValueChange={(v) => setSelectedClientId(Number(v))}
        >
          <SelectTrigger className="w-full max-w-md h-10">
            <SelectValue placeholder={clientsLoading ? "Đang tải..." : "Tìm và chọn khách hàng..."} />
          </SelectTrigger>
          <SelectContent>
            {clients?.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: c.avatar_color }}
                  >
                    {c.ten_viet_tat}
                  </span>
                  <span className="truncate">{c.ten}</span>
                  <span className="text-muted-foreground text-xs ml-1">({c.ma_so_thue})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {!selectedClientId && (
        <div className="text-center py-20 text-muted-foreground">
          Vui lòng chọn một khách hàng để xem trạng thái doanh nghiệp
        </div>
      )}

      {selectedClientId && (
        <div className="space-y-4">
          {/* ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Client Info */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">THÔNG TIN KHÁCH HÀNG</h3>
              {svcLoading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white relative"
                      style={{ backgroundColor: selectedClient?.avatar_color || "hsl(215 70% 42%)" }}
                    >
                      {selectedClient?.ten_viet_tat || "?"}
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border shadow flex items-center justify-center">
                        <Settings className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{selectedClient?.ten}</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">MST:</span> <span className="font-medium">{selectedClient?.ma_so_thue}</span></div>
                    <div><span className="text-muted-foreground">Địa chỉ:</span> <span className="font-medium">{serviceInfo?.email || "—"}</span></div>
                    <div><span className="text-muted-foreground">Đại diện pháp luật:</span> <span className="font-medium">—</span></div>
                  </div>
                </div>
              )}
            </Card>

            {/* Revenue Chart */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">BIỂU ĐỒ DOANH THU VÀ CHI PHÍ</h3>
              {chartLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => fmt(value) + " VND"} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="revenue" name="Doanh thu" fill="hsl(215 70% 42%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expense" name="Chi phí" fill="hsl(152 60% 42%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* VAT + Credentials */}
            <div className="space-y-4">
              {/* VAT summary */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">BIỂU ĐỒ THUẾ</h3>
                {vatLoading ? (
                  <div className="flex gap-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 flex-1" />)}</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-primary/10 p-3 text-center">
                      <div className="text-xs text-muted-foreground">VAT đầu vào</div>
                      <div className="text-sm font-bold text-primary mt-1">{fmt(vatSummary?.inputVat || 0)}</div>
                    </div>
                    <div className="rounded-lg bg-[hsl(38_92%_50%/0.1)] p-3 text-center">
                      <div className="text-xs text-muted-foreground">VAT đầu ra</div>
                      <div className="text-sm font-bold text-[hsl(38,92%,50%)] mt-1">{fmt(vatSummary?.outputVat || 0)}</div>
                    </div>
                    <div className="rounded-lg bg-destructive/10 p-3 text-center">
                      <div className="text-xs text-muted-foreground">VAT phải nộp</div>
                      <div className="text-sm font-bold text-destructive mt-1">{fmt(vatSummary?.payableVat || 0)}</div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Credentials */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">THÔNG TIN ĐĂNG NHẬP</h3>
                {credLoading ? (
                  <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
                ) : (
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20">
                          <TableHead className="text-[10px] py-1">Loại</TableHead>
                          <TableHead className="text-[10px] py-1">Tài khoản</TableHead>
                          <TableHead className="text-[10px] py-1">Mật khẩu</TableHead>
                          <TableHead className="text-[10px] py-1 w-8"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {credentials?.map((cred) => (
                          <TableRow key={cred.id}>
                            <TableCell className="text-[10px] py-1.5">{cred.type}</TableCell>
                            <TableCell className="text-[10px] py-1.5 font-mono">{cred.account}</TableCell>
                            <TableCell className="text-[10px] py-1.5 font-mono">
                              {visiblePasswords.has(cred.id) ? cred.password : "••••••••"}
                            </TableCell>
                            <TableCell className="py-1.5">
                              <button onClick={() => togglePassword(cred.id)} className="p-0.5 rounded hover:bg-muted">
                                {visiblePasswords.has(cred.id) ?
                                  <EyeOff className="h-3 w-3 text-muted-foreground" /> :
                                  <Eye className="h-3 w-3 text-muted-foreground" />
                                }
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Service Info */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">THÔNG TIN DỊCH VỤ</h3>
              {svcLoading ? (
                <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
              ) : serviceInfo && (
                <div className="space-y-2 text-sm">
                  {[
                    ["Nhân viên phụ trách", serviceInfo.assignedStaff],
                    ["Phí dịch vụ", fmt(serviceInfo.serviceFee) + " VND"],
                    ["Kỳ tính phí", serviceInfo.feePeriod],
                    ["Tình hình công nợ", fmt(serviceInfo.currentDebt) + " VND"],
                    ["Ngày thành lập", serviceInfo.establishmentDate],
                    ["Vốn điều lệ", fmt(serviceInfo.charterCapital) + " VND"],
                    ["Thông tư áp dụng", serviceInfo.appliedCircular],
                    ["Email", serviceInfo.email],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}:</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Tax Declaration */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">THÔNG TIN KHAI THUẾ</h3>
              {declLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <p className="text-sm text-muted-foreground">{taxDecl?.description}</p>
              )}
            </Card>

            {/* Annual Tax */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">THÔNG TIN KHAI THUẾ THEO NĂM</h3>
                <Select value={annualYear.toString()} onValueChange={(v) => setAnnualYear(Number(v))}>
                  <SelectTrigger className="w-[90px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {annualLoading ? (
                <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="text-xs">Loại</TableHead>
                      <TableHead className="text-xs text-center w-20">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {annualTax?.map((item) => (
                      <TableRow key={item.type}>
                        <TableCell className="text-xs py-2">{item.type}</TableCell>
                        <TableCell className="text-center py-2">
                          {item.status === "submitted" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>

          {/* ROW 3 — Business Status Tables */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">TRẠNG THÁI DOANH NGHIỆP</h2>
            <Select value={statusYear.toString()} onValueChange={(v) => setStatusYear(Number(v))}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {bizLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[200px] w-full rounded-lg" />)}
            </div>
          ) : bizStatus && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StatusTable title="MUA HÀNG" icon={ShoppingCart} iconColor="text-primary" rows={bizStatus.purchasing} />
              <StatusTable title="BÁN HÀNG" icon={TrendingUp} iconColor="text-emerald-500" rows={bizStatus.sales} />
              <StatusTable title="THUẾ GTGT" icon={Receipt} iconColor="text-destructive" rows={bizStatus.vat} />
              <StatusTable title="LƯƠNG" icon={Users} iconColor="text-primary" rows={bizStatus.payroll} />
              <StatusTable title="TÀI SẢN CỐ ĐỊNH" icon={Building} iconColor="text-amber-500" rows={bizStatus.fixedAssets} />
              <StatusTable title="TÀI SẢN PHÂN BỔ" icon={PackageOpen} iconColor="text-violet-500" rows={bizStatus.allocatedAssets} />
              <StatusTable title="KẾ TOÁN TỔNG HỢP" icon={Calculator} iconColor="text-primary" rows={bizStatus.generalAccounting} />
              <StatusTable title="TIỀN GỬI NGÂN HÀNG" icon={Landmark} iconColor="text-primary" rows={bizStatus.bankDeposits} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
